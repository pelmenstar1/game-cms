import { ApiError } from '@game-cms/base-core';
import { apiRoute } from '@game-cms/core/api';
import { cms } from '@game-cms/global';
import z from 'zod';

import { getEntityValidationType } from '../../utils/entity.js';
import { entityRouteId } from '../../utils/routeId.js';

export default apiRoute({
  url: '/entity/:entityId',
  method: 'POST',
  config: {
    id: entityRouteId('create'),
  },
  schema: {
    params: z.object({
      entityId: z.string(),
    }),
  },
  handler: async (req, res) => {
    const schema = getEntityValidationType(req.params.entityId);
    const body = schema.safeParse(req.body);
    if (!body.success) {
      throw new ApiError(body.error.message, 'base::schema/validation');
    }

    const result = await cms()
      .service('base::entity')
      .create(req.params.entityId, body.data);

    res.status(201);
    return result;
  },
});
