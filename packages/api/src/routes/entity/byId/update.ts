import { objectId } from '@game-cms/shared/mongo';
import { ApiError, ApiErrorCode } from '@game-cms/shared-api';
import { apiRoute } from '@game-cms/utils';
import z from 'zod';

import { getEntityValidationType } from '../../../utils/entity.js';

export default apiRoute({
  url: '/entity/:entityId/byId/:id',
  method: 'PUT',
  schema: {
    params: z.object({
      entityId: z.string(),
      id: objectId,
    }),
  },
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
