import { deleteStorageItemOptions } from '@game-cms/base-types/schema';
import { cms } from '@game-cms/global';
import { stringObjectId } from '@game-cms/shared/mongo';
import { apiRoute } from '@game-cms/utils';
import z from 'zod';

export default apiRoute({
  url: '/storage/byId/:id',
  method: 'DELETE',
  config: {
    id: 'storage$delete',
  },
  schema: {
    params: z.object({
      id: stringObjectId,
    }),
    querystring: deleteStorageItemOptions,
  },
  handler: async (req) => {
    const { id } = req.params;
    const options = req.query;

    await cms().service('base::storage').deleteById(id, options);
  },
});
