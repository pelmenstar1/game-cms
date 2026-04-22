import {
  EntityClientSchemaById,
  EntityClientSchemaMap,
  EntityId,
} from '@game-cms/base-core';
import { json, request, RequestContext } from '@game-cms/core/api/client';

export const getEntitySchemas = (context: RequestContext) =>
  request(context, {
    url: '/entitySchema/list',
    response: json<EntityClientSchemaMap>(),
  });

export const getEntitySchema = <T extends EntityId>(
  context: RequestContext,
  entityId: T
) =>
  request(context, {
    url: `/entitySchema/${entityId}`,
    response: json<EntityClientSchemaById<T>>(),
  });
