import { ApiError, ApiErrorCode } from '@game-cms/shared-api';
import { apiRoute } from '@game-cms/utils';
import z from 'zod';

import { authHandler } from '../../middlewares/auth.js';
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
  preHandler: [authHandler()],
  handler: async (req, res) => {
    const schema = getEntityValidationType(req.params.entityId);
    const body = schema.safeParse(req.body);
    if (!body.success) {
      throw new ApiError(body.error.message, ApiErrorCode.VALIDATION_ISSUE);
    }

    const result = await cms
      .service('base::entity')
      .create(req.params.entityId, body.data);

    res.status(201);
    return result;
  },
});
