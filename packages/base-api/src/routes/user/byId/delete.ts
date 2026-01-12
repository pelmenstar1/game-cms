import { apiRoute } from '@game-cms/core/api';
import { cms } from '@game-cms/global';
import { objectId } from '@game-cms/shared/mongo';
import z from 'zod';

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
  handler: async (req, res) => {
    const { id } = req.params;

    await cms().service('base::user').delete(id);

    res.status(200);
  },
});
