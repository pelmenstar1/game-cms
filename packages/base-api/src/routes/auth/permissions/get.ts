import { GetAllPermissionsResponse } from '@game-cms/base-core';
import { apiRoute } from '@game-cms/core/api';
import { cms } from '@game-cms/global';

export default apiRoute({
  url: '/auth/permissions',
  method: 'GET',
  handler: (): GetAllPermissionsResponse => {
    const permissions = cms().service('base::auth').getAllPermissions();

    return { permissions: [...permissions] };
  },
});
