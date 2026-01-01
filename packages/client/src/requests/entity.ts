import type {
  EntityDataById,
  EntityId,
  EntitySchema,
  EntitySchemaById,
} from '@game-cms/base-types';
import type { PageData, PagingOptions } from '@game-cms/shared';
import type {
  ComponentDataResolverArgs,
  RequestContext,
} from '@game-cms/types';
import qs from 'qs';

import { request, url } from '../internal/utils.js';
import { jsonInit } from '../requestInitializer.js';
import { json } from '../responseParser.js';

export type EntityDataByIdWithId<T extends EntityId> = EntityDataById<T> & {
  _id: string;
};

export type EntityResolvedDataByIdWithId<T extends EntityId> =
  EntityDataById<T> & {
    _id: string;
  };

export const getEntitySchemas = (context: RequestContext) =>
  request(context, {
    url: `/entitySchema/list`,
    response: json<EntitySchema[]>(),
  });

export const getEntitySchema = <T extends EntityId>(
  context: RequestContext,
  entityId: T
) =>
  request(context, {
    url: `/entitySchema/byId/${entityId}`,
    response: json<EntitySchemaById<T>>(),
  });

export const createEntity = <T extends EntityId>(
  context: RequestContext,
  entityId: T,
  body: EntityDataById<T>
) =>
  request(context, {
    url: `/entity/${entityId}`,
    method: 'POST',
    body: jsonInit(body),
    response: json<EntityDataByIdWithId<T>>(),
  });

export const getEntityById = <T extends EntityId>(
  context: RequestContext,
  entityId: T,
  id: string,
  args?: ComponentDataResolverArgs
) =>
  request(context, {
    url: url({
      path: `/entity/${entityId}/byId/${id}`,
      search: qs.stringify(args),
    }),
    response: json<EntityDataByIdWithId<T>>(),
  });

export const updateEntityById = <T extends EntityId>(
  context: RequestContext,
  entityId: T,
  id: string,
  data: EntityDataById<T>
) =>
  request(context, {
    url: `/entity/${entityId}/byId/${id}`,
    method: 'PUT',
    body: jsonInit(data),
  });

export const getRawEntityById = <T extends EntityId>(
  context: RequestContext,
  entityId: T,
  id: string
) =>
  request(context, {
    url: `/entity/${entityId}/raw/byId/${id}`,
    response: json<EntityDataByIdWithId<T>>(),
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
  options: PagingOptions
) =>
  request(context, {
    url: url({ path: `/entity/${entityId}/list`, search: options }),
    response: json<PageData<EntityDataByIdWithId<T>>>(),
  });
