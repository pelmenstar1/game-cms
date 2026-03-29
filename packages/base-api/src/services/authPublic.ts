import { service } from '@game-cms/core';
import type { ApiRouteId } from '@game-cms/core/api';
import { cms } from '@game-cms/global';

declare module '@game-cms/base-core' {
  interface DatabaseCollectionTypeMap {
    'base::auth::public': {
      permissions: ApiRouteId[];
    };
  }
}

function collection() {
  return cms().service('base::database').collection('base::auth::public');
}

async function getPermissions() {
  const result = await collection().findOne();

  return result?.permissions ?? [];
}

export default service({
  lifecycle: {},
  getPermissions,
  isPublicRoute: async (id: ApiRouteId) => {
    const permissions = await getPermissions();

    return permissions.includes(id);
  },
  updatePermissions: async (permissions: ApiRouteId[]) => {
    await collection().updateOne(
      {},
      { $set: { permissions } },
      { upsert: true }
    );
  },
});
