import { ApiError } from '@game-cms/base-core';
import { entityVariant } from '@game-cms/base-core/schema';
import { apiRoute } from '@game-cms/core/api';
import { cms } from '@game-cms/global';
import { stringObjectId } from '@game-cms/shared/mongo';
import qs from 'qs';
import z from 'zod';

import { entityRouteId } from '../../../utils/routeId.js';

export default apiRoute({
  url: '/entity/:entityId/byId/:id',
  method: 'GET',
  config: {
    id: entityRouteId('get'),
  },
  schema: {
    params: z.object({
      entityId: z.string(),
      id: stringObjectId,
    }),
  },
  handler: async (req) => {
    const { entityId, id } = req.params;

    const { search } = new URL(req.url, 'http://localhost');
    const { variant: rawVariant, ...rest } = qs.parse(search);
    const variant = entityVariant.parse(rawVariant ?? 'published');

    const result = await cms()
      .service('base::entity')
      .getResolvedById(entityId, id, rest, variant);

    if (result === null) {
      throw new ApiError('Entity not found', 'base::entity/notFound');
    }

    return result;
  },
});
