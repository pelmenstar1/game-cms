import { objectId } from '@game-cms/shared/mongo';
import { ApiError, ApiErrorCode } from '@game-cms/shared-api';
import { apiRoute } from '@game-cms/shared-api';
import z from 'zod';

import { authHandler } from '../../../middlewares/auth.js';
import { getEntityValidationType } from '../../../utils/entity.js';
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
      id: objectId,
    }),
  },
  preHandler: [authHandler()],
  handler: async (req) => {
    const { entityId, id } = req.params;

    const schema = getEntityValidationType(req.params.entityId);
    const body = schema.safeParse(req.body);
    if (!body.success) {
      throw new ApiError(body.error.message, ApiErrorCode.VALIDATION_ISSUE);
    }

    await cms.service('base::entity').update(entityId, id, body.data);
  },
});
