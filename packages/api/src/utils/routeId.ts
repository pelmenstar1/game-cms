import type { ApiRouteId } from '@game-cms/types';

export function entityRouteId(action: string): ApiRouteId {
  return `entity/[entityId]$${action}`;
}

export function parseApiRouteId(id: ApiRouteId) {
  const [namespace, action] = id.split('$', 2);

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (namespace === undefined || action === undefined) {
    throw new Error(`Invalid API route ID: ${id}`);
  }

  return { namespace, action };
}
