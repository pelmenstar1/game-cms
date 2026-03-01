import { EntityInternalOutDataById } from '@game-cms/base-core';
import { apiRoute } from '@game-cms/core/api';
import { pagingOptionsSchema } from '@game-cms/core/schema';
import { cms } from '@game-cms/global';
import { PageData } from '@game-cms/shared';
import z from 'zod';

import { entityRouteId } from '../../utils/routeId.js';

export default apiRoute({
  url: '/entity/:entityId/list',
  method: 'GET',
  config: {
    id: entityRouteId('get'),
  },
  schema: {
    params: z.object({
      entityId: z.string(),
    }),
    querystring: pagingOptionsSchema,
  },
  handler: async (
    req
  ): Promise<PageData<EntityInternalOutDataById<string>>> => {
    const { entityId } = req.params;
    const options = req.query;

    const result = await cms()
      .service('base::entity')
      .list(entityId, { ...options, signal: req.abortSignal });

    return result;
  },
});
