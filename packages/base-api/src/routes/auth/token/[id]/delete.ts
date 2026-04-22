import { apiRoute } from '@game-cms/core/api';
import { cms } from '@game-cms/global';
import { stringObjectId } from '@game-cms/shared/mongo';
import z from 'zod';

export default apiRoute({
  url: '/auth/token/:id',
  method: 'DELETE',
  config: {
    id: 'auth/token$delete',
  },
  schema: {
    params: z.object({
      id: stringObjectId,
    }),
  },
  handler: async (req) => {
    const { id } = req.params;

    await cms().service('base::auth::apiToken').deleteById(id);
  },
});
