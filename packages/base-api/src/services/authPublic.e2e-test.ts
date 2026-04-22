import type { ApiRouteId } from '@game-cms/core/api';
import { describe, expect, it } from '@game-cms/e2e';
import { cms } from '@game-cms/global';

function service() {
  return cms().service('base::auth::public');
}

async function withPermissions(permissions: ApiRouteId[]) {
  await service().updatePermissions(permissions);

  return {
    [Symbol.asyncDispose]: async () => {
      await service().updatePermissions([]);
    },
  };
}

describe('getPermissions', () => {
  it('should return empty array when no permissions are set', async () => {
    await using _ = await withPermissions([]);

    const result = await service().getPermissions();
    expect(result).toEqual([]);
  });

  it('should return the stored permissions', async () => {
    const permissions: ApiRouteId[] = ['storage$list', 'user$get'];

    await using _ = await withPermissions(permissions);
    const result = await service().getPermissions();

    expect(new Set(result)).toEqual(new Set(permissions));
  });
});

describe('isPublicRoute', () => {
  it('should return true for a route in the permissions list', async () => {
    const routeId: ApiRouteId = 'storage$list';

    await using _ = await withPermissions([routeId]);
    const result = await service().isPublicRoute(routeId);

    expect(result).toBe(true);
  });

  it('should return false for a route not in the permissions list', async () => {
    await using _ = await withPermissions(['storage$list']);
    const result = await service().isPublicRoute('user$create');

    expect(result).toBe(false);
  });

  it('should return false when permissions list is empty', async () => {
    await using _ = await withPermissions([]);
    const result = await service().isPublicRoute('storage$list');

    expect(result).toBe(false);
  });
});

describe('updatePermissions', () => {
  it('should persist the new permissions', async () => {
    const permissions: ApiRouteId[] = ['storage$list'];
    await using _ = await withPermissions(permissions);

    const stored = await service().getPermissions();
    expect(new Set(stored)).toEqual(new Set(permissions));
  });

  it('should overwrite previously set permissions', async () => {
    await using _ = await withPermissions(['storage$list']);

    await service().updatePermissions(['user$get', 'user$create']);
    const stored = await service().getPermissions();

    expect(new Set(stored)).toEqual(new Set(['user$get', 'user$create']));
  });
});
