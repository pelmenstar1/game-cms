import { ApiError, apiRoute } from '@game-cms/core/api';
import { cms } from '@game-cms/global';
import { stringObjectId } from '@game-cms/shared/mongo';
import z from 'zod';

export default apiRoute({
  url: '/storage/items/:id',
  method: 'GET',
  config: {
    id: 'storage$get',
  },
  schema: {
    params: z.object({
      id: stringObjectId,
    }),
  },
  handler: async (req) => {
    const { id } = req.params;

    const result = await cms().service('base::storage').getInfo(id);
    if (result === null) {
      throw new ApiError('Unknown item', { code: 'base::entity/notFound' });
    }

    return result;
  },
});
