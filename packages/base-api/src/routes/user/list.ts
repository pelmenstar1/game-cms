import { pagingOptionsSchema } from '@game-cms/types';
import { apiRoute } from '@game-cms/utils';

export default apiRoute({
  url: '/user/list',
  method: 'GET',
  schema: {
    querystring: pagingOptionsSchema,
  },
  handler: async (req) => {
    const options = req.query;

    const users = await cms.service('base::user').list(options);

    return users;
  },
});
