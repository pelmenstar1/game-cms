import { opaqueApiToken } from '@game-cms/base-types/schema';
import { ApiError } from '@game-cms/base-utils';
import { apiRoute } from '@game-cms/core';
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

    const result = await cms().service('base::auth::apiToken').getById(id);
    if (result === null) {
      throw new ApiError('Unknown API token', 'base::entity/notFound');
    }

    return result;
  },
});
