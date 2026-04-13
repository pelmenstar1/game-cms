import { ApiError, apiRoute } from '@game-cms/core/api';
import { cms } from '@game-cms/global';
import { stringObjectId } from '@game-cms/shared/mongo';
import z from 'zod';

export default apiRoute({
  url: '/entityChecks/runs/:id',
  method: 'GET',
  schema: {
    params: z.object({
      id: stringObjectId,
    }),
  },
  config: {
    id: 'entityCheck/runs$get',
  },
  handler: async (req) => {
    const { id } = req.params;

    const run = await cms()
      .service('base::entityCheck::run')
      .getById({ id, signal: req.abortSignal });

    if (run === null) {
      throw new ApiError('Run not found', 'base::entity/notFound');
    }

    return run;
  },
});
