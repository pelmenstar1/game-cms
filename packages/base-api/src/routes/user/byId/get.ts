import { ApiError } from '@game-cms/core/api';
import { apiRoute } from '@game-cms/core/api';
import { cms } from '@game-cms/global';
import { stringObjectId } from '@game-cms/shared/mongo';
import z from 'zod';

export default apiRoute({
  url: '/user/byId/:id',
  method: 'GET',
  config: {
    id: 'user$get',
  },
  schema: {
    params: z.object({
      id: stringObjectId,
    }),
  },
  handler: async (req) => {
    const { id } = req.params;

    const user = await cms()
      .service('base::user')
      .getById(id, { signal: req.abortSignal });

    if (user === null) {
      throw new ApiError('User not found', 'base::entity/notFound');
    }

    return user;
  },
});
