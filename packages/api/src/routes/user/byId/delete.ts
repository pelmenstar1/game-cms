import { objectId } from '@game-cms/shared/mongo';
import { apiRoute } from '@game-cms/utils';
import z from 'zod';

import { authHandler } from '../../../middlewares/auth.js';

export default apiRoute({
  url: '/user/byId/:id',
  method: 'DELETE',
  config: {
    id: 'user$delete',
  },
  schema: {
    params: z.object({
      id: objectId,
    }),
  },
  preHandler: [authHandler()],
  handler: async (req, res) => {
    const { id } = req.params;

    await cms.service('base::user').delete(id);

    res.status(200);
  },
});
