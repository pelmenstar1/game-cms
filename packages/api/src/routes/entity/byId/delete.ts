import { objectId } from '@game-cms/shared/mongo';
import { apiRoute } from '@game-cms/shared-api';
import z from 'zod';

import { entityRouteId } from '../../../utils/routeId.js';

export default apiRoute({
  url: '/entity/:entityId/byId/:id',
  method: 'DELETE',
  config: {
    id: entityRouteId('delete'),
  },
  schema: {
    params: z.object({
      entityId: z.string(),
      id: objectId,
    }),
  },
  handler: async (req) => {
    const { entityId, id } = req.params;

    await cms.service('base::entity').deleteById(entityId, id);
  },
});
