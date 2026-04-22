import { GetPublicPermissionsResponse } from '@game-cms/base-core';
import { apiRoute } from '@game-cms/core/api';
import { cms } from '@game-cms/global';

export default apiRoute({
  url: '/auth/permissions/public',
  method: 'GET',
  config: {
    id: 'auth/permissions/public$get',
  },
  handler: async (): Promise<GetPublicPermissionsResponse> => {
    const permissions = await cms()
      .service('base::auth::public')
      .getPermissions();

    return { permissions };
  },
});
