import type { PagingOptions } from '@game-cms/shared';
import type { CreateUserPayload, ServerUser } from '@game-cms/types';
import { service } from '@game-cms/utils';
import type { ClientSession, ObjectId } from 'mongodb';

import { getPage } from '../utils/paging.js';
import { hashPassword, verifyPassword } from '../utils/password.js';

type NoPasswordUser = Omit<ServerUser, 'passwordHash'>;

function users() {
  return cms.service('base::database').collection('base::users');
}

async function updatePassword(
  email: string,
  newPassword: string,
  session?: ClientSession
) {
  const passwordHash = await hashPassword(newPassword);

  await users().updateOne({ email }, { $set: { passwordHash } }, { session });
}

export default service({
  id: 'base::user',
  init: async () => {
    await users().createIndex({ email: 1 }, { unique: true });
  },
  getById: async (id: ObjectId) => {
    const result = await users().findOne<NoPasswordUser>(
      { _id: id },
      { projection: { passwordHash: 0 } }
    );

    return result;
  },
  list: async (options: PagingOptions) => {
    const result = await getPage<ServerUser, NoPasswordUser>(users(), options, [
      { $projection: { passwordHash: 0 } },
    ]);

    return result;
  },
  create: async (payload: CreateUserPayload) => {
    const passwordHash = await hashPassword(payload.password);

    const user = await users().insertOne({
      name: payload.name,
      email: payload.email,
      passwordHash: passwordHash,
      permissions: payload.permissions,
    });

    return { id: user.insertedId };
  },
  delete: async (id: ObjectId) => {
    await users().deleteOne({ _id: id });
  },
  updatePassword,
  updatePasswordIfOldMatches: async (
    email: string,
    oldPassword: string,
    newPassword: string
  ) => {
    return await cms
      .service('base::database')
      .withTransaction(async (session) => {
        const user = await users().findOne(
          { email },
          { session, projection: { passwordHash: 1 } }
        );

        if (user === null) {
          return false;
        }

        const passwordMatch = await verifyPassword(
          user.passwordHash,
          oldPassword
        );

        if (!passwordMatch) {
          return false;
        }

        await updatePassword(email, newPassword, session);

        return true;
      });
  },
  updatePermissions: async (email: string, permissions: string[]) => {
    await users().updateOne({ email }, { $set: { permissions } });
  },
});
