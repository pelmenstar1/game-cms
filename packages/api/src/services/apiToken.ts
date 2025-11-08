import { env } from '@game-cms/env';
import { randomBytes } from '@game-cms/shared/crypto';
import { service } from '@game-cms/shared-api';
import type { CreateApiTokenPayload } from '@game-cms/types';

function collection() {
  return cms.service('base::database').collection('base::apiTokens');
}

async function generateToken() {
  const byteLength = env().config.auth.apiToken?.byteLength ?? 256;

  const buffer = await randomBytes(byteLength);

  return buffer.toString('base64url');
}

export default service({
  id: 'base::auth::apiToken',
  init: async () => {
    await collection().createIndex({ token: 1 }, { unique: true });
  },
  get: (token: string) => {
    return cms
      .service('base::database')
      .collection('base::apiTokens')
      .findOne({ $and: [{ token }] });
  },
  create: async (payload: CreateApiTokenPayload) => {
    const token = await generateToken();

    const now = Date.now();
    await collection().insertOne({
      token,
      expirationDate: new Date(now + payload.expirationTime),
      name: payload.name,
      permissions: payload.permissions,
    });

    return { token };
  },
  delete: async (token: string) => {
    await collection().deleteOne({ token });
  },
});
