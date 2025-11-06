import { deleteApiTokenPayload } from '@game-cms/types';
import { apiRoute } from '@game-cms/utils';

export default apiRoute({
  url: `/auth/token`,
  method: 'DELETE',
  schema: {
    body: deleteApiTokenPayload,
  },
  handler: async (req, res) => {
    const { token } = req.body;

    await cms.service('base::auth::apiToken').delete(token);

    res.status(200);
  },
});
