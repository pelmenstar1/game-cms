import type { ConditionalValueInput } from '@game-cms/conditional';
import { objectId } from '@game-cms/shared';
import { apiRoute } from '@game-cms/utils';
import qs from 'qs';
import z from 'zod';

export default apiRoute({
  url: '/entity/:entityId/byId/:id',
  method: 'GET',
  schema: {
    params: z.object({
      entityId: z.string(),
      id: objectId,
    }),
  },
  handler: async (req) => {
    const { entityId, id } = req.params;

    const { search } = new URL(req.url);
    const filter = qs.parse(search);

    const result = await cms
      .service('base::entity')
      .getById(entityId, id, filter as ConditionalValueInput);

    return result;
  },
});
