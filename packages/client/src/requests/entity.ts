import type {
  EntityId,
  EntityRawDataWithChecksById,
  EntityRawInDataById,
  EntityResolvedDataById,
  EntitySchema,
  EntitySchemaById,
  EntityVariant,
} from '@game-cms/base-core';
import type { ComponentDataResolverArgs } from '@game-cms/core';
import { json, type RequestContext } from '@game-cms/core/api';
import type { PageData, PagingOptions } from '@game-cms/shared';
import qs from 'qs';

import { url } from '../internal/utils.js';
import { jsonInit } from '../requestInitializer.js';
import { request } from '../utils.js';

export type EntityDataByIdWithId<T extends EntityId> =
  EntityRawDataWithChecksById<T> & {
    _id: string;
  };

export type EntityDataInByIdWithId<T extends EntityId> =
  EntityRawInDataById<T> & {
    _id: string;
  };

export type EntityResolvedDataByIdWithId<T extends EntityId> =
  EntityResolvedDataById<T> & {
    _id: string;
  };

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
  body: EntityRawInDataById<Id>,
  variant?: EntityVariant
) =>
  request(context, {
    url: url({ path: `/entity/${entityId}`, search: { variant } }),
    method: 'POST',
    body: jsonInit(body),
    response: json<EntityDataInByIdWithId<Id>>(),
  });

export const getEntityById = <T extends EntityId>(
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
    response: json<EntityDataByIdWithId<T>>(),
  });

export const updateEntityById = <T extends EntityId>(
  context: RequestContext,
  entityId: T,
  id: string,
  data: EntityRawInDataById<T>,
  variant?: EntityVariant
) =>
  request(context, {
    url: url({ path: `/entity/${entityId}/byId/${id}`, search: { variant } }),
    method: 'PUT',
    body: jsonInit(data),
  });

export const getRawEntityById = <T extends EntityId>(
  context: RequestContext,
  entityId: T,
  id: string,
  variant?: EntityVariant
) =>
  request(context, {
    url: url({
      path: `/entity/${entityId}/raw/byId/${id}`,
      search: { variant },
    }),
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
    response: json<PageData<EntityDataByIdWithId<T>>>(),
  });
