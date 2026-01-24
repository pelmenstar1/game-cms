import { getPublicPermissionsResponse } from '@game-cms/base-core/schema';
import { apiRoute } from '@game-cms/core/api';
import { cms } from '@game-cms/global';

export default apiRoute({
  url: '/auth/permissions/public',
  method: 'GET',
  config: {
    id: 'auth/permissions/public$get',
  },
  schema: {
    response: {
      200: getPublicPermissionsResponse,
    },
  },
  handler: async () => {
    const permissions = await cms()
      .service('base::auth::public')
      .getPermissions();

    return { permissions };
  },
});
