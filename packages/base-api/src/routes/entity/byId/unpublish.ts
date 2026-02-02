import { ApiError } from '@game-cms/core/api';
import { apiRoute } from '@game-cms/core/api';
import { cms } from '@game-cms/global';
import { stringObjectId } from '@game-cms/shared/mongo';
import z from 'zod';

import { entityRouteId } from '../../../utils/routeId.js';

export default apiRoute({
  url: '/entity/:entityId/byId/:id/unpublish',
  method: 'POST',
  config: {
    id: entityRouteId('delete'),
  },
  schema: {
    params: z.object({
      entityId: z.string(),
      id: stringObjectId,
    }),
  },
  handler: async (req) => {
    const { entityId, id } = req.params;

    const result = await cms().service('base::entity').unpublish(entityId, id);

    if (!result) {
      throw new ApiError('Entity not found', 'base::entity/notFound');
    }
  },
});
