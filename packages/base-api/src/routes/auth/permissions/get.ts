import { getAllPermissionsResponse } from '@game-cms/base-core/schema';
import { apiRoute } from '@game-cms/core/api';
import { cms } from '@game-cms/global';

export default apiRoute({
  url: '/auth/permissions',
  method: 'GET',
  schema: {
    response: {
      200: getAllPermissionsResponse,
    },
  },
  handler: () => {
    const permissions = cms().service('base::auth').getAllPermissions();

    return { permissions: [...permissions] };
  },
});
