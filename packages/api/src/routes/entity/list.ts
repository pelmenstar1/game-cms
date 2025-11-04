import { apiRoute } from '@game-cms/utils';
import z from 'zod';

export default apiRoute({
  url: `/entity/:entityId/list`,
  method: 'GET',
  schema: {
    params: z.object({
      entityId: z.string(),
    }),
    querystring: z.object({
      offset: z.number().min(0).optional(),
      size: z.number().refine((value) => value === -1 || value >= 1),
    }),
  },
  handler: async (req) => {
    const { entityId } = req.params;
    const options = req.query;

    const result = await cms.service('base::entity').list(entityId, options);

    return result;
  },
});
