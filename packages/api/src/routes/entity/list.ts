import { apiRoute } from '@game-cms/shared-api';
import { pagingOptionsSchema } from '@game-cms/types';
import z from 'zod';

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
  handler: async (req) => {
    const { entityId } = req.params;
    const options = req.query;

    const result = await cms.service('base::entity').list(entityId, options);

    return result;
  },
});
