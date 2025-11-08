import { apiRoute } from '@game-cms/shared-api';
import { createApiTokenPayload, createApiTokenResponse } from '@game-cms/types';

import { authHandler } from '../../../middlewares/auth.js';

export default apiRoute({
  url: '/auth/token',
  method: 'POST',
  config: {
    id: 'auth/token$create',
  },
  schema: {
    body: createApiTokenPayload,
    response: { 200: createApiTokenResponse },
  },
  preHandler: [authHandler()],
  handler: async (req) => {
    const payload = req.body;

    const result = await cms.service('base::auth::apiToken').create(payload);

    return result;
  },
});
