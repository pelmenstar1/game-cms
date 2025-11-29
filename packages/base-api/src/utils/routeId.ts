import { isNonNullObject } from '@game-cms/shared';
import type { ApiRouteId } from '@game-cms/types';

export function entityRouteId(action: string): ApiRouteId {
  return `entity/[entityId]$${action}`;
}

export function parseApiRouteId(id: ApiRouteId) {
  const delimiterIndex = id.indexOf('$');
  if (delimiterIndex == -1) {
    throw new Error(`Invalid API route ID: ${id}`);
  }

  return {
    namespace: id.slice(0, delimiterIndex),
    action: id.slice(delimiterIndex + 1),
  };
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
