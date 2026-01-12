import { type ApiRouteId, parseApiRouteId } from '@game-cms/core/api';
import { isNonNullObject } from '@game-cms/shared';

export function entityRouteId(action: string): ApiRouteId {
  return `entity/[entityId]$${action}`;
}

export function hydrateRouteId(id: ApiRouteId, params: unknown): ApiRouteId {
  if (!isNonNullObject(params)) {
    return id;
  }

  const { namespace, action } = parseApiRouteId(id);

  const newNamespace = namespace
    .split('/')
    .map((part) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        const key = part.slice(1, -1);
        const value = (params as Record<string, unknown>)[key];

        if (value !== undefined) {
          // eslint-disable-next-line @typescript-eslint/no-base-to-string
          return String(value);
        }
      }

      return part;
    })
    .join('/');

  return `${newNamespace}$${action}`;
}
