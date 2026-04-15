import { opaqueApiToken } from '@game-cms/base-core/schema';
import { ApiError } from '@game-cms/core/api';
import { apiRoute } from '@game-cms/core/api';
import { cms } from '@game-cms/global';
import { stringObjectId } from '@game-cms/shared/mongo';
import z from 'zod';

export default apiRoute({
  url: '/auth/token/byId/:id',
  method: 'GET',
  config: {
    id: 'auth/token$get',
  },
  schema: {
    params: z.object({
      id: stringObjectId,
    }),
    response: { 200: opaqueApiToken },
  },
  handler: async (req) => {
    const { id } = req.params;

    const result = await cms()
      .service('base::auth::apiToken')
      .getById(id, { signal: req.abortSignal });

    if (result === null) {
      throw new ApiError('Unknown API token', {
        code: 'base::entity/notFound',
      });
    }

    return result;
  },
});
