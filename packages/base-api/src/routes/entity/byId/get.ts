import { cms } from '@game-cms/global';
import { stringObjectId } from '@game-cms/shared/mongo';
import { apiRoute } from '@game-cms/utils';
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
    const filter = qs.parse(search);

    const result = await cms()
      .service('base::entity')
      .getResolvedById(entityId, id, filter);

    return result;
  },
});
