import { apiRoute } from '@game-cms/core/api';
import { pagingOptionsSchema } from '@game-cms/core/schema';
import { cms } from '@game-cms/global';

export default apiRoute({
  url: '/auth/token/list',
  method: 'GET',
  config: {
    id: 'auth/token$get',
  },
  schema: {
    querystring: pagingOptionsSchema,
  },
  handler: async (req) => {
    const options = req.query;

    return cms().service('base::auth::apiToken').list(options);
  },
});
