import { apiRoute } from '@game-cms/shared-api';
import { getPermissionsResponse } from '@game-cms/types';

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
