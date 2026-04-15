import { EntityInternalOutDataById } from '@game-cms/base-core';
import { entityVariant } from '@game-cms/base-core/schema';
import { ApiError, apiRoute } from '@game-cms/core/api';
import { cms } from '@game-cms/global';
import { stringObjectId } from '@game-cms/shared/mongo';
import z from 'zod';

import { entityRouteId } from '../../../../utils/routeId.js';

export default apiRoute({
  url: '/entity/:entityId/internal/byId/:id',
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
  handler: async (req): Promise<EntityInternalOutDataById<string>> => {
    const { entityId, id } = req.params;
    const { variant } = req.query;

    const result = await cms()
      .service('base::entity')
      .getRawById(entityId, id, variant, { signal: req.abortSignal });

    if (result === null) {
      throw new ApiError('Entity not found', { code: 'base::entity/notFound' });
    }

    return result;
  },
});
