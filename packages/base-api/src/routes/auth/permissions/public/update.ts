import { updatePublicPermissionsPayload } from '@game-cms/base-core/schema';
import { apiRoute } from '@game-cms/core/api';
import { cms } from '@game-cms/global';

export default apiRoute({
  url: '/auth/permissions/public',
  method: 'PUT',
  config: {
    id: 'auth/permissions/public$update',
  },
  schema: {
    body: updatePublicPermissionsPayload,
  },
  handler: async (req) => {
    const { permissions } = req.body;

    await cms().service('base::auth::public').updatePermissions(permissions);
  },
});
