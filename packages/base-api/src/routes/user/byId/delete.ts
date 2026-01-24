import { ApiError } from '@game-cms/base-core';
import { apiRoute } from '@game-cms/core/api';
import { cms } from '@game-cms/global';
import { stringObjectId } from '@game-cms/shared/mongo';
import z from 'zod';

export default apiRoute({
  url: '/user/byId/:id',
  method: 'DELETE',
  config: {
    id: 'user$delete',
  },
  schema: {
    params: z.object({
      id: stringObjectId,
    }),
  },
  handler: async (req) => {
    const { id } = req.params;

    const result = await cms().service('base::user').delete(id);
    if (!result) {
      throw new ApiError('User not found', 'base::entity/notFound');
    }
  },
});
