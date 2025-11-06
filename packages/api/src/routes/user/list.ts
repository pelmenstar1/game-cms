import { apiRoute } from '@game-cms/utils';

import { authHandler } from '../../middlewares/auth.js';
import { pagingOptionsSchema } from '../../utils/paging.js';

export default apiRoute({
  url: '/user/list',
  method: 'GET',
  schema: {
    querystring: pagingOptionsSchema,
  },
  preHandler: [authHandler()],
  handler: async (req) => {
    const options = req.query;

    const users = await cms.service('base::user').list(options);

    return users;
  },
});
