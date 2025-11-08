import { apiRoute } from '@game-cms/shared-api';
import { pagingOptionsSchema } from '@game-cms/types';

import { authHandler } from '../../middlewares/auth.js';

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
