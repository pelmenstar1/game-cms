import type {
  CreateApiTokenPayload,
  OpaqueApiToken,
  OpaqueApiTokenWithId,
} from '@game-cms/base-core';
import { ApiError } from '@game-cms/base-core';
import { service } from '@game-cms/core';
import { cms, env } from '@game-cms/global';
import type { PageData, PagingOptions } from '@game-cms/shared';
import { randomBytes } from '@game-cms/shared/crypto';
import type { ObjectId } from 'mongodb';

import { getPage } from '../utils/paging.js';

function collection() {
  return cms().service('base::database').collection('base::apiTokens');
}

async function generateToken() {
  const byteLength = env().config.auth.apiToken?.byteLength ?? 256;

  const buffer = await randomBytes(byteLength);

  return buffer.toString('base64url');
}

function isValidPermissions(permissions: string[]) {
  const allPermissions = cms().service('base::auth').getAllPermissions();

  return permissions.every((name) => allPermissions.includes(name));
}

const opaqueProjection = { name: 1, expirationDate: 1, permissions: 1 };
const opaqueProjectionWithId = { _id: 1, ...opaqueProjection };

export default service({
  id: 'base::auth::apiToken',
  init: async () => {
    await collection().createIndex({ token: 1 }, { unique: true });
  },
  getByToken: (token: string) => {
    return collection().findOne({ token });
  },
  getById: (id: ObjectId): Promise<OpaqueApiToken | null> => {
    return collection().findOne({ _id: id }, { projection: opaqueProjection });
  },
  list: async (
    options: PagingOptions
  ): Promise<PageData<OpaqueApiTokenWithId>> => {
    const { items, meta } = await getPage(collection(), options, {
      post: [
        {
          $project: {
            items: opaqueProjectionWithId,
            meta: 1,
          },
        },
      ],
    });

    return {
      items: items.map(({ _id, ...rest }) => ({ id: _id, ...rest })),
      meta,
    };
  },
  create: async (payload: CreateApiTokenPayload) => {
    if (!isValidPermissions(payload.permissions)) {
      throw new ApiError('Unknown permissions', 'base::schema/validation');
    }

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
  deleteById: async (id: ObjectId) => {
    await collection().deleteOne({ _id: id });
  },
});
