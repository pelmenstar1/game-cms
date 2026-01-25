import type {
  ApiToken,
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

declare module '@game-cms/base-core' {
  interface AppEventsRegistry {
    'base::apiToken::created': CreateApiTokenPayload & {
      token: string;
      id: ObjectId;
    };
    'base::apiToken::deleted': { id: ObjectId };
  }

  interface DatabaseEntityMap {
    'base::apiTokens': ApiToken;
  }
}

function collection() {
  return cms().service('base::database').collection('base::apiTokens');
}

async function generateToken() {
  const byteLength = env().config.auth.apiToken?.byteLength ?? 256;

  const buffer = await randomBytes(byteLength);

  return buffer.toString('base64url');
}

const opaqueProjection = { name: 1, expirationDate: 1, permissions: 1 };
const opaqueProjectionWithId = { _id: 1, ...opaqueProjection };

export default service({
  id: 'base::auth::apiToken',
  lifecycle: {
    onInit: async () => {
      await collection().createIndex({ token: 1 }, { unique: true });
    },
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
    const { permissions } = payload;

    if (!cms().service('base::auth').isValidPermissions(permissions)) {
      throw new ApiError('Unknown permissions', 'base::schema/validation');
    }

    const token = await generateToken();

    const now = Date.now();
    const { insertedId } = await collection().insertOne({
      token,
      expirationDate: new Date(now + payload.expirationTime),
      name: payload.name,
      permissions,
    });

    cms()
      .service('base::appEvents')
      .emit('base::apiToken::created', { ...payload, token, id: insertedId });

    return { id: insertedId, token };
  },
  deleteById: async (id: ObjectId) => {
    await collection().deleteOne({ _id: id });

    cms().service('base::appEvents').emit('base::apiToken::deleted', { id });
  },
});
