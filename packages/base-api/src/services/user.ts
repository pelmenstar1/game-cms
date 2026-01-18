import {
  ApiError,
  type CreateUserPayload,
  type PermissionId,
  type ServerUser,
} from '@game-cms/base-core';
import { service } from '@game-cms/core';
import { cms, env } from '@game-cms/global';
import type { PagingOptions } from '@game-cms/shared';
import { isDuplicateKeyError } from '@game-cms/shared/mongo';
import type { ClientSession, Filter, ObjectId } from 'mongodb';

import { getPage } from '../utils/paging.js';
import { hashPassword, verifyPassword } from '../utils/password.js';

type NoPasswordUser = Omit<ServerUser & { _id: ObjectId }, 'passwordHash'>;

function users() {
  return cms().service('base::database').collection('base::users');
}

async function updatePassword(
  email: string,
  newPassword: string,
  session?: ClientSession
) {
  const passwordHash = await hashPassword(newPassword);

  await users().updateOne({ email }, { $set: { passwordHash } }, { session });
}

async function verifyUserPassword(
  email: string,
  password: string,
  session?: ClientSession
) {
  const user = await users().findOne(
    { email },
    { session, projection: { passwordHash: 1 } }
  );

  if (user === null) {
    return false;
  }

  return await verifyPassword(user.passwordHash, password);
}

function getByFilter(filter: Filter<ServerUser>) {
  return users().findOne<NoPasswordUser>(filter, {
    projection: { passwordHash: 0 },
  });
}

async function createIndices() {
  await users().createIndex({ email: 1 }, { unique: true });
}

async function createUser(payload: CreateUserPayload) {
  try {
    const passwordHash = await hashPassword(payload.password);

    const user = await users().insertOne({
      name: payload.name,
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
    await createUser({ name: 'Admin', email, password, permissions: ['*'] });
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
  init: async () => {
    await createIndices();
    await addAdminUser();
  },
  getBy: getByFilter,
  getById: async (id: ObjectId) => {
    return await getByFilter({ _id: id });
  },
  getByEmail: async (email: string) => {
    return await getByFilter({ email });
  },
  fullGetBy: (filter: Filter<ServerUser>) => {
    return users().findOne(filter);
  },
  list: async (options: PagingOptions) => {
    const result = await getPage<ServerUser, NoPasswordUser>(users(), options, {
      post: [{ $project: { passwordHash: 0 } }],
    });

    return result;
  },
  create: createUser,
  delete: async (id: ObjectId) => {
    await users().deleteOne({ _id: id });
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
  updatePermissions: async (email: string, permissions: PermissionId[]) => {
    await users().updateOne({ email }, { $set: { permissions } });
  },
});
