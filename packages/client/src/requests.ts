import type { EntityConditionalDataById } from '@game-cms/conditional';
import { formatSearchParams, type PagingOptions } from '@game-cms/shared';
import type {
  ClientEntitySchema,
  ComponentId,
  ComponentRenderManifest,
  EntityId,
  PageData,
} from '@game-cms/types';

import { jsonInit } from './requestInitializer.js';
import { json } from './responseParser.js';
import type {
  RequestContext,
  RequestOptions,
  RequestOptionsWithResult,
} from './types.js';

type EntityConditionalDataByIdWithId<T extends EntityId> =
  EntityConditionalDataById<T> & { _id: string };

function request<Args extends unknown[], R>(
  factory: (...args: Args) => RequestOptionsWithResult<R>
): (context: RequestContext, ...args: Args) => Promise<R>;

function request<Args extends unknown[]>(
  factory: (...args: Args) => RequestOptions
): (context: RequestContext, ...args: Args) => Promise<Response>;

function request<Args extends unknown[], R>(
  factory: (...args: Args) => RequestOptions | RequestOptionsWithResult<R>
) {
  return (context: RequestContext, ...args: Args) => {
    const signal = context.abortController?.signal;
    const init = factory(...args);
    if (signal) {
      init.signal = signal;
    }

    return context.client.makeRequest(init);
  };
}

export const getComponentManifest = request((key: ComponentId) => ({
  path: `/_components/${key}/manifest.json`,
  response: json<ComponentRenderManifest>(),
}));

export const getEntitySchemas = request(() => ({
  path: `/entitySchema/list`,
  response: json<ClientEntitySchema[]>(),
}));

export const createEntity = request(
  <T extends EntityId>(entityId: T, body: EntityConditionalDataById<T>) => ({
    path: `/entity/${entityId}`,
    method: 'POST',
    body: jsonInit(body),
    response: json<EntityConditionalDataByIdWithId<T>>(),
  })
);

export const getEntityById = request(
  <T extends EntityId>(entityId: T, id: string) => ({
    path: `/entity/${entityId}/byId/${id}`,
    method: 'GET',
    response: json<EntityConditionalDataByIdWithId<T>>(),
  })
);

export const deleteEntityById = request((entityId: EntityId, id: string) => ({
  path: `/entity/${entityId}/byId/${id}`,
  method: 'DELETE',
}));

export const listEntities = request(
  <T extends EntityId>(entityId: T, options: PagingOptions) => ({
    path: `/entity/${entityId}/list?${formatSearchParams(options)}`,
    response: json<PageData<EntityConditionalDataByIdWithId<T>>>(),
  })
);
