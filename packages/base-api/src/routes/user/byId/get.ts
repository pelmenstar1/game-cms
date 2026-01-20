import { apiRoute } from '@game-cms/core/api';
import { cms } from '@game-cms/global';
import { objectId } from '@game-cms/shared/mongo';
import z from 'zod';

export default apiRoute({
  url: '/user/byId/:id',
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

    const user = await cms().service('base::user').getById(id);

    return user;
  },
});
