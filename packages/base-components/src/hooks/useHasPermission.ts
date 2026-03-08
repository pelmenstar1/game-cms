import { ApiRouteId } from '@game-cms/core/api';

import { useSelfSession } from './useSelfSession.js';

export function useHasPermission(target: ApiRouteId) {
  const { permissions } = useSelfSession();

  return permissions.has(target);
}
