import { storageItemWithMeta } from '@game-cms/base-types/schema';
import { ApiError } from '@game-cms/base-utils';
import { apiRoute } from '@game-cms/core';
import { cms } from '@game-cms/global';
import { stringObjectId } from '@game-cms/shared/mongo';
import z from 'zod';

export default apiRoute({
  url: '/storage/byId/:id',
  method: 'GET',
  config: {
    id: 'storage$get',
  },
  schema: {
    params: z.object({
      id: stringObjectId,
    }),
    response: { 200: storageItemWithMeta },
  },
  handler: async (req) => {
    const { id } = req.params;

    const result = await cms().service('base::storage').getInfo(id);
    if (result === null) {
      throw new ApiError('Unknown item', 'base::entity/notFound');
    }

    return result;
  },
});
