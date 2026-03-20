import { ApiError } from '@game-cms/core/api';
import { apiRoute } from '@game-cms/core/api';
import { cms } from '@game-cms/global';
import z from 'zod';

export default apiRoute({
  url: '/entitySchema/byId/:id',
  method: 'GET',
  config: {
    id: 'entitySchema$get',
  },
  schema: {
    params: z.object({
      id: z.string(),
    }),
  },
  handler: (req) => {
    const { id } = req.params;
    const result = cms().service('base::entitySchema').getSchemaById(id);

    if (result === null) {
      throw new ApiError('Unknown entity', 'base::entity/notFound');
    }

    return result;
  },
});
