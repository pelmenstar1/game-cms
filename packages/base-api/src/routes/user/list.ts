import { apiRoute } from '@game-cms/core/api';
import { pagingOptionsSchema } from '@game-cms/core/schema';
import { cms } from '@game-cms/global';

export default apiRoute({
  url: '/user/list',
  method: 'GET',
  schema: {
    querystring: pagingOptionsSchema,
  },
  handler: async (req) => {
    const options = req.query;

    const users = await cms().service('base::user').list(options);

    return users;
  },
});
