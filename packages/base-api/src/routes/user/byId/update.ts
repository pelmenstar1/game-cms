import { updateUserPayload } from '@game-cms/base-core/schema';
import { ApiError } from '@game-cms/core/api';
import { apiRoute } from '@game-cms/core/api';
import { cms } from '@game-cms/global';
import { stringObjectId } from '@game-cms/shared/mongo';
import z from 'zod';

export default apiRoute({
  url: '/user/byId/:id',
  method: 'PUT',
  config: {
    id: 'user$update',
  },
  schema: {
    params: z.object({
      id: stringObjectId,
    }),
    body: updateUserPayload,
  },
  handler: async (req) => {
    const { id } = req.params;
    const payload = req.body;

    const result = await cms().service('base::user').updateById(id, payload);
    if (!result) {
      throw new ApiError('User not found', { code: 'base::entity/notFound' });
    }
  },
});
