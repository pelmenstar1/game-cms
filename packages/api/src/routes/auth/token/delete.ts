import { apiRoute } from '@game-cms/shared-api';
import { deleteApiTokenPayload } from '@game-cms/types';

export default apiRoute({
  url: `/auth/token`,
  method: 'DELETE',
  config: {
    id: 'auth/token$delete',
  },
  schema: {
    body: deleteApiTokenPayload,
  },
  handler: async (req, res) => {
    const { token } = req.body;

    await cms.service('base::auth::apiToken').delete(token);

    res.status(200);
  },
});
