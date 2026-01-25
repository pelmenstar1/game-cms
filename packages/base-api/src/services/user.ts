import {
  ApiError,
  type CreateUserPayload,
  type UpdateUserPayload,
  type User,
} from '@game-cms/base-core';
import { service } from '@game-cms/core';
import type { ApiRouteId } from '@game-cms/core/api';
import { cms, env } from '@game-cms/global';
import type { PagingOptions } from '@game-cms/shared';
import { isDuplicateKeyError } from '@game-cms/shared/mongo';
import type {
  ClientSession,
  Document,
  Filter,
  ObjectId,
  WithId,
} from 'mongodb';

import { getPage } from '../utils/paging.js';
import { hashPassword, verifyPassword } from '../utils/password.js';

type NoPasswordServerUser = Omit<User, 'passwordHash'> & { id: ObjectId };

declare module '@game-cms/base-core' {
  interface DatabaseEntityMap {
    'base::users': User;
  }
}

function collection() {
  return cms().service('base::database').collection('base::users');
}

async function updatePassword(
  email: string,
  newPassword: string,
  session?: ClientSession
) {
  const passwordHash = await hashPassword(newPassword);

  await collection().updateOne(
    { email },
    { $set: { passwordHash } },
    { session }
  );
}

async function verifyUserPassword(
  email: string,
  password: string,
  session?: ClientSession
) {
  const user = await collection().findOne(
    { email },
    { session, projection: { passwordHash: 1 } }
  );

  if (user === null) {
    return false;
  }

  return await verifyPassword(user.passwordHash, password);
}

function hydrateUser<T extends { isAdmin?: true; permissions: ApiRouteId[] }>(
  value: T
): T {
  return {
    ...value,
    permissions: value.isAdmin
      ? [...cms().service('base::auth').getAllPermissions()]
      : value.permissions,
  };
}

async function getByFilter<T>(
  filter: Filter<User>,
  projection?: Document
): Promise<T | null> {
  const result = await collection().findOne(filter, {
    projection,
  });

  if (result !== null) {
    const { _id, ...rest } = result;

    return hydrateUser({ id: _id, ...rest }) as T;
  }

  return null;
}

async function createIndices() {
  await collection().createIndex({ email: 1 }, { unique: true });
}

async function createUser(
  payload: CreateUserPayload & {
    isAdmin?: true;
  }
) {
  try {
    const passwordHash = await hashPassword(payload.password);

    const user = await collection().insertOne({
      displayName: payload.displayName,
      email: payload.email,
      passwordHash,
      permissions: payload.permissions,
      isAdmin: payload.isAdmin,
    });

    return { id: user.insertedId };
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new ApiError(
        'User with specified email already exists',
        'base::entity/duplicate'
      );
    }

    throw error;
  }
}

async function addAdminUser() {
  const { email, password } = env().config.auth.admin;

  try {
    await createUser({
      displayName: 'Admin',
      email,
      password,
      permissions: [],
      isAdmin: true,
    });
  } catch (error) {
    if (
      !(error instanceof ApiError && error.code === 'base::entity/duplicate')
    ) {
      throw error;
    }
  }
}

export default service({
  id: 'base::user',
  lifecycle: {
    onInit: async () => {
      await createIndices();
      await addAdminUser();
    },
  },
  getBy: getByFilter,
  getById: (id: ObjectId) => {
    return getByFilter<NoPasswordServerUser>({ _id: id }, { passwordHash: 0 });
  },
  getByEmail: (email: string) => {
    return getByFilter<NoPasswordServerUser>({ email }, { passwordHash: 0 });
  },
  fullGetBy: async (filter: Filter<User>) => {
    const result = await getByFilter<User & { id: ObjectId }>(filter);

    return result && hydrateUser(result);
  },
  list: async (options: PagingOptions) => {
    const result = await getPage<User, WithId<Omit<User, 'passwordHash'>>>(
      collection(),
      options,
      {
        post: [{ $project: { items: { passwordHash: 0 } } }],
      }
    );

    return {
      items: result.items.map(({ _id, ...rest }) =>
        hydrateUser({ id: _id, ...rest })
      ),
      meta: result.meta,
    };
  },
  create: async (payload: CreateUserPayload) => {
    if (!cms().service('base::auth').isValidPermissions(payload.permissions)) {
      throw new ApiError('Unknown permissions', 'base::schema/validation');
    }

    return createUser(payload);
  },
  delete: async (id: ObjectId) => {
    const result = await collection().deleteOne({
      _id: id,
      isAdmin: { $ne: true },
    });

    return result.deletedCount > 0;
  },
  updatePassword,
  updatePasswordIfOldMatches: async (
    email: string,
    oldPassword: string,
    newPassword: string
  ) => {
    const passwordMatch = await verifyUserPassword(email, oldPassword);

    if (!passwordMatch) {
      return false;
    }

    await updatePassword(email, newPassword);

    return true;
  },
  verifyPassword: verifyUserPassword,
  updateById: async (
    id: ObjectId,
    { password, ...rest }: UpdateUserPayload
  ) => {
    const passwordHash = password ? await hashPassword(password) : undefined;

    const result = await collection().updateOne(
      { _id: id, isAdmin: { $ne: true } },
      { $set: { passwordHash, ...rest } }
    );

    return result.modifiedCount > 0;
  },
});
