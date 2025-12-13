import { getPermissionsResponse } from '@game-cms/base-types/schema';
import { cms } from '@game-cms/global';
import { apiRoute } from '@game-cms/utils';

export default apiRoute({
  url: '/auth/permissions',
  method: 'GET',
  schema: {
    response: {
      200: getPermissionsResponse,
    },
  },
  handler: () => {
    const permissions = cms().service('base::auth').getAllPermissions();

    return { permissions };
  },
});
