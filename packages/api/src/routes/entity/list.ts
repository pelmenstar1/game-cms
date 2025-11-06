import { apiRoute } from '@game-cms/utils';
import z from 'zod';

import { authHandler } from '../../middlewares/auth.js';
import { pagingOptionsSchema } from '../../utils/paging.js';
import { entityRouteId } from '../../utils/routeId.js';

export default apiRoute({
  url: `/entity/:entityId/list`,
  method: 'GET',
  config: {
    id: entityRouteId('list'),
  },
  schema: {
    params: z.object({
      entityId: z.string(),
    }),
    querystring: pagingOptionsSchema,
  },
  preHandler: [authHandler()],
  handler: async (req) => {
    const { entityId } = req.params;
    const options = req.query;

    const result = await cms.service('base::entity').list(entityId, options);

    return result;
  },
});
