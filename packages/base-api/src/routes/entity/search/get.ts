import { EntityInternalOutDataById } from '@game-cms/base-core';
import { apiRoute } from '@game-cms/core/api';
import { pagingOptionsSchema } from '@game-cms/core/schema';
import { cms } from '@game-cms/global';
import { PageData } from '@game-cms/shared';
import z from 'zod';

import { entityRouteId } from '../../../utils/routeId.js';

export default apiRoute({
  url: '/entity/:entityId/search',
  method: 'GET',
  config: {
    id: entityRouteId('search'),
  },
  schema: {
    params: z.object({
      entityId: z.string(),
    }),
    querystring: z.object({
      query: z.string().min(1),
      ...pagingOptionsSchema.shape,
    }),
  },
  handler: async (
    req
  ): Promise<PageData<EntityInternalOutDataById<string>>> => {
    const { entityId } = req.params;
    const { query, ...pagingOptions } = req.query;

    return cms()
      .service('base::entity')
      .search(entityId, query, { ...pagingOptions, signal: req.abortSignal });
  },
});
