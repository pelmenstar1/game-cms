import { ApiError, ApiErrorCode } from '@game-cms/shared-api';
import { apiRoute } from '@game-cms/utils';
import z from 'zod';

export default apiRoute({
  url: '/entitySchema/byId/:id',
  method: 'GET',
  schema: {
    params: z.object({
      id: z.string(),
    }),
  },
  handler: (req) => {
    const { id } = req.params;
    const result = cms.service('base::entitySchema').getClientById(id);

    if (result === null) {
      throw new ApiError(
        'Entity schema not found',
        ApiErrorCode.ENTITY_NOT_FOUND
      );
    }

    return result;
  },
});
