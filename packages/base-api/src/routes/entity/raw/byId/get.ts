import { entityVariant } from '@game-cms/base-core/schema';
import { ApiError } from '@game-cms/core/api';
import { apiRoute } from '@game-cms/core/api';
import { cms } from '@game-cms/global';
import { stringObjectId } from '@game-cms/shared/mongo';
import z from 'zod';

import { entityRouteId } from '../../../../utils/routeId.js';

export default apiRoute({
  url: '/entity/:entityId/raw/byId/:id',
  method: 'GET',
  config: {
    id: entityRouteId('get'),
  },
  schema: {
    params: z.object({
      entityId: z.string(),
      id: stringObjectId,
    }),
    querystring: z.object({
      variant: entityVariant.default('published'),
    }),
  },
  handler: async (req) => {
    const { entityId, id } = req.params;
    const { variant } = req.query;

    const result = await cms()
      .service('base::entity')
      .getRawById(entityId, id, variant);

    if (result === null) {
      throw new ApiError('Entity not found', 'base::entity/notFound');
    }

    return result;
  },
});
