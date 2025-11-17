import type {
  ConditionalValueInput,
  EntityConditionalDataById,
} from '@game-cms/conditional';
import type { PageData, PagingOptions } from '@game-cms/shared';
import type {
  ClientEntitySchema,
  EntityId,
  GetEntityById,
} from '@game-cms/types';
import qs from 'qs';

import { request, url } from '../internal/utils.js';
import { jsonInit } from '../requestInitializer.js';
import { json } from '../responseParser.js';
import type { RequestContext } from '../types.js';

export type EntityDataByIdWithId<T extends EntityId> = GetEntityById<T> & {
  _id: string;
};

export type EntityConditionalDataByIdWithId<T extends EntityId> =
  EntityConditionalDataById<T> & { _id: string };

export const getEntitySchemas = (context: RequestContext) =>
  request(context, {
    url: `/entitySchema/list`,
    response: json<ClientEntitySchema[]>(),
  });

export const getEntitySchema = <T extends EntityId>(
  context: RequestContext,
  entityId: T
) =>
  request(context, {
    url: `/entitySchema/byId/${entityId}`,
    response: json<ClientEntitySchema<GetEntityById<T>>>(),
  });

export const createEntity = <T extends EntityId>(
  context: RequestContext,
  entityId: T,
  body: EntityConditionalDataById<T>
) =>
  request(context, {
    url: `/entity/${entityId}`,
    method: 'POST',
    body: jsonInit(body),
    response: json<EntityConditionalDataByIdWithId<T>>(),
  });

export const getEntityById = <T extends EntityId>(
  context: RequestContext,
  entityId: T,
  id: string,
  conditions?: ConditionalValueInput
) =>
  request(context, {
    url: url({
      path: `/entity/${entityId}/byId/${id}`,
      search: qs.stringify(conditions),
    }),
    response: json<EntityDataByIdWithId<T>>(),
  });

export const getRawEntityById = <T extends EntityId>(
  context: RequestContext,
  entityId: T,
  id: string
) =>
  request(context, {
    url: `/entity/${entityId}/raw/byId/${id}`,
    response: json<EntityConditionalDataByIdWithId<T>>(),
  });

export const deleteEntityById = (
  context: RequestContext,
  entityId: EntityId,
  id: string
) =>
  request(context, {
    url: `/entity/${entityId}/byId/${id}`,
    method: 'DELETE',
  });

export const listEntities = <T extends EntityId>(
  context: RequestContext,
  entityId: T,
  options?: PagingOptions
) =>
  request(context, {
    url: url({ path: `/entity/${entityId}/list`, search: options }),
    response: json<PageData<EntityDataByIdWithId<T>>>(),
  });
