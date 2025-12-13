import { cms } from '@game-cms/global';
import { objectId } from '@game-cms/shared/mongo';
import { apiRoute } from '@game-cms/utils';
import z from 'zod';

export default apiRoute({
  url: '/entity/:entityid/raw/byId/:id',
  method: 'GET',
  config: {
    id: 'entity$get',
  },
  schema: {
    params: z.object({
      entityId: z.string(),
      id: objectId,
    }),
  },
  handler: async (req) => {
    const { entityId, id } = req.params;

    const result = await cms().service('base::entity').getRawById(entityId, id);

    return result;
  },
});
