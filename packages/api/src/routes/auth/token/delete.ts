import { apiRoute } from '@game-cms/shared-api';
import { deleteApiTokenPayload } from '@game-cms/types';

import { authHandler } from '../../../middlewares/auth.js';

export default apiRoute({
  url: `/auth/token`,
  method: 'DELETE',
  config: {
    id: 'auth/token$delete',
  },
  schema: {
    body: deleteApiTokenPayload,
  },
  preHandler: [authHandler()],
  handler: async (req, res) => {
    const { token } = req.body;

    await cms.service('base::auth::apiToken').delete(token);

    res.status(200);
  },
});
