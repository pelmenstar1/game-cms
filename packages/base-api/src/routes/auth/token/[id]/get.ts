import { OpaqueApiToken } from '@game-cms/base-core';
import { ApiError, apiRoute } from '@game-cms/core/api';
import { cms } from '@game-cms/global';
import { stringObjectId } from '@game-cms/shared/mongo';
import z from 'zod';

export default apiRoute({
  url: '/auth/token/:id',
  method: 'GET',
  config: {
    id: 'auth/token$get',
  },
  schema: {
    params: z.object({
      id: stringObjectId,
    }),
  },
  handler: async (req): Promise<OpaqueApiToken> => {
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
