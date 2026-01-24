import {
  ApiError,
  type CreateUserPayload,
  type UpdateUserPayload,
  type User,
} from '@game-cms/base-core';
import { service } from '@game-cms/core';
import { cms, env } from '@game-cms/global';
import type { PagingOptions } from '@game-cms/shared';
import { isDuplicateKeyError } from '@game-cms/shared/mongo';
import type { ClientSession, Filter, ObjectId } from 'mongodb';

import { getPage } from '../utils/paging.js';
import { hashPassword, verifyPassword } from '../utils/password.js';

type NoPasswordServerUser = Omit<User, 'passwordHash'> & { _id: ObjectId };

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

function getByFilter(filter: Filter<User>) {
  return collection().findOne<NoPasswordServerUser>(filter, {
    projection: { passwordHash: 0 },
  });
}

async function createIndices() {
  await collection().createIndex({ email: 1 }, { unique: true });
}

async function createUser(payload: CreateUserPayload) {
  try {
    const passwordHash = await hashPassword(payload.password);

    const user = await collection().insertOne({
      displayName: payload.displayName,
      email: payload.email,
      passwordHash: passwordHash,
      permissions: payload.permissions,
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
      permissions: ['*'],
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
  getById: async (id: ObjectId) => {
    return await getByFilter({ _id: id });
  },
  getByEmail: async (email: string) => {
    return await getByFilter({ email });
  },
  fullGetBy: (filter: Filter<User>) => {
    return collection().findOne(filter);
  },
  list: async (options: PagingOptions) => {
    const result = await getPage<User, NoPasswordServerUser>(
      collection(),
      options,
      {
        post: [{ $project: { passwordHash: 0 } }],
      }
    );

    return result;
  },
  create: createUser,
  delete: async (id: ObjectId) => {
    await collection().deleteOne({ _id: id });
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

    await collection().updateOne(
      { _id: id },
      { $set: { passwordHash, ...rest } }
    );
  },
});
