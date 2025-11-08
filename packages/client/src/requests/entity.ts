import type { EntityConditionalDataById } from '@game-cms/conditional';
import type { PageData, PagingOptions } from '@game-cms/shared';
import type { ClientEntitySchema, EntityId } from '@game-cms/types';

import { jsonInit } from '../requestInitializer.js';
import { json } from '../responseParser.js';
import { request } from '../utils.js';

type EntityConditionalDataByIdWithId<T extends EntityId> =
  EntityConditionalDataById<T> & { _id: string };

export const getEntitySchemas = request(() => ({
  url: `/entitySchema/list`,
  response: json<ClientEntitySchema[]>(),
}));

export const createEntity = request(
  <T extends EntityId>(entityId: T, body: EntityConditionalDataById<T>) => ({
    url: `/entity/${entityId}`,
    method: 'POST',
    body: jsonInit(body),
    response: json<EntityConditionalDataByIdWithId<T>>(),
  })
);

export const getEntityById = request(
  <T extends EntityId>(entityId: T, id: string) => ({
    url: `/entity/${entityId}/byId/${id}`,
    response: json<EntityConditionalDataByIdWithId<T>>(),
  })
);

export const deleteEntityById = request((entityId: EntityId, id: string) => ({
  url: `/entity/${entityId}/byId/${id}`,
  method: 'DELETE',
}));

export const listEntities = request(
  <T extends EntityId>(entityId: T, options: PagingOptions) => ({
    url: { path: `/entity/${entityId}/list`, search: options },
    response: json<PageData<EntityConditionalDataByIdWithId<T>>>(),
  })
);
