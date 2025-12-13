import { deleteApiTokenPayload } from '@game-cms/base-types/schema';
import { cms } from '@game-cms/global';
import { apiRoute } from '@game-cms/utils';

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

    await cms().service('base::auth::apiToken').delete(token);

    res.status(200);
  },
});
