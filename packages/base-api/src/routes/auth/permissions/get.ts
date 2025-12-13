import { getPermissionsResponse } from '@game-cms/base-types/schema';
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
    const permissions = cms.service('base::auth').getAllPermissions();

    return { permissions };
  },
});
