import { apiRoute } from '@game-cms/core';
import { cms } from '@game-cms/global';
import { stringObjectId } from '@game-cms/shared/mongo';
import z from 'zod';

export default apiRoute({
  url: '/entity/:entityId/raw/byId/:id',
  method: 'GET',
  config: {
    id: 'entity/[entityId]$get',
  },
  schema: {
    params: z.object({
      entityId: z.string(),
      id: stringObjectId,
    }),
  },
  handler: async (req) => {
    const { entityId, id } = req.params;

    const result = await cms().service('base::entity').getRawById(entityId, id);

    return result;
  },
});
