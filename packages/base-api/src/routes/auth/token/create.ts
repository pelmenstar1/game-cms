import {
  createApiTokenPayload,
  createApiTokenResponse,
} from '@game-cms/base-core/schema';
import { apiRoute } from '@game-cms/core/api';
import { cms } from '@game-cms/global';

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
  handler: async (req) => {
    const payload = req.body;

    const result = await cms().service('base::auth::apiToken').create(payload);

    return result;
  },
});
