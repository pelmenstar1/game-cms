import { ApiError } from '@game-cms/base-core';
import { entityVariant } from '@game-cms/base-core/schema';
import { apiRoute } from '@game-cms/core/api';
import { cms } from '@game-cms/global';
import { stringObjectId } from '@game-cms/shared/mongo';
import z from 'zod';

import { getEntityValidationPartialType } from '../../../utils/entity.js';
import { entityRouteId } from '../../../utils/routeId.js';

export default apiRoute({
  url: '/entity/:entityId/byId/:id',
  method: 'PUT',
  config: {
    id: entityRouteId('update'),
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

    const schema = getEntityValidationPartialType(req.params.entityId);
    const body = schema.safeParse(req.body);
    if (!body.success) {
      throw new ApiError(
        'Entity validation failed',
        'base::schema/validation',
        body.error.issues
      );
    }

    await cms()
      .service('base::entity')
      .update(entityId, id, body.data, variant);
  },
});
