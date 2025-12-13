import { ApiError } from '@game-cms/base-utils';
import { cms } from '@game-cms/global';
import { objectId } from '@game-cms/shared/mongo';
import { apiRoute } from '@game-cms/utils';
import z from 'zod';

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
  handler: async (req) => {
    const { entityId, id } = req.params;

    const schema = getEntityValidationType(req.params.entityId);
    const body = schema.safeParse(req.body);
    if (!body.success) {
      throw new ApiError(body.error.message, 'base::schema/validation');
    }

    await cms().service('base::entity').update(entityId, id, body.data);
  },
});
