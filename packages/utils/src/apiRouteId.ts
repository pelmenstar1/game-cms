import type { ApiRouteId } from '@game-cms/types';

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
