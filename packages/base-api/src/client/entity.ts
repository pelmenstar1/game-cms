import type {
  EntityId,
  EntityInDataById,
  EntityInDataByIdWithId,
  EntityInternalOutDataById,
  EntityResolvedDataByIdWithId,
  EntitySchema,
  EntitySchemaById,
  EntityVariant,
} from '@game-cms/base-core';
import type { ComponentDataResolverArgs } from '@game-cms/core';
import {
  json,
  jsonInit,
  request,
  RequestContext,
  url,
} from '@game-cms/core/api/client';
import type { PageData, PagingOptions } from '@game-cms/shared';
import qs from 'qs';

export const getEntitySchemas = (context: RequestContext) =>
  request(context, {
    url: '/entitySchema/list',
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

export const createEntity = <Id extends EntityId>(
  context: RequestContext,
  entityId: Id,
  body: EntityInDataById<Id>,
  variant?: EntityVariant
) =>
  request(context, {
    url: url({ path: `/entity/${entityId}`, search: { variant } }),
    method: 'POST',
    body: jsonInit(body),
    response: json<EntityInDataByIdWithId<Id>>(),
  });

export const getResolvedEntityById = <T extends EntityId>(
  context: RequestContext,
  entityId: T,
  id: string,
  args?: ComponentDataResolverArgs,
  variant?: EntityVariant
) =>
  request(context, {
    url: url({
      path: `/entity/${entityId}/byId/${id}`,
      search: qs.stringify({ ...args, variant }),
    }),
    response: json<EntityResolvedDataByIdWithId<T>>(),
  });

export const updateEntityById = <T extends EntityId>(
  context: RequestContext,
  entityId: T,
  id: string,
  data: EntityInDataById<T>,
  variant?: EntityVariant
) =>
  request(context, {
    url: url({ path: `/entity/${entityId}/byId/${id}`, search: { variant } }),
    method: 'PUT',
    body: jsonInit(data),
  });

export const getRawEntityDocumentById = <T extends EntityId>(
  context: RequestContext,
  entityId: T,
  id: string,
  variant?: EntityVariant
) =>
  request(context, {
    url: url({
      path: `/entity/${entityId}/internal/byId/${id}`,
      search: { variant },
    }),
    response: json<EntityInternalOutDataById<T>>(),
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

export const unpublishEntity = (
  context: RequestContext,
  entityId: EntityId,
  id: string
) =>
  request(context, {
    url: `/entity/${entityId}/byId/${id}/unpublish`,
    method: 'POST',
  });

export const listEntities = <T extends EntityId>(
  context: RequestContext,
  entityId: T,
  options: PagingOptions
) =>
  request(context, {
    url: url({ path: `/entity/${entityId}/list`, search: options }),
    response: json<PageData<EntityInternalOutDataById<T, string>>>(),
  });

export const searchEntities = <T extends EntityId>(
  context: RequestContext,
  entityId: T,
  query: string,
  options?: PagingOptions
) =>
  request(context, {
    url: url({
      path: `/entity/${entityId}/search`,
      search: { query, ...options },
    }),
    response: json<PageData<EntityInternalOutDataById<T, string>>>(),
  });
