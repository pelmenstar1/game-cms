import { cms } from '@game-cms/global';
import { pagingOptionsSchema } from '@game-cms/types/schema';
import { apiRoute } from '@game-cms/utils';

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
