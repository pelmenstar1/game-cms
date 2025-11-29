import { objectId } from '@game-cms/shared/mongo';
import { apiRoute } from '@game-cms/utils';
import z from 'zod';

export default apiRoute({
  url: '/users/byId/:id',
  method: 'GET',
  config: {
    id: 'user$get',
  },
  schema: {
    params: z.object({
      id: objectId,
    }),
  },
  handler: async (req) => {
    const { id } = req.params;

    const user = await cms.service('base::user').getById(id);

    return user;
  },
});
