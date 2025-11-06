import { createApiTokenPayload, createApiTokenResponse } from '@game-cms/types';
import { apiRoute } from '@game-cms/utils';

export default apiRoute({
  url: '/auth/token',
  method: 'POST',
  schema: {
    body: createApiTokenPayload,
    response: { 200: createApiTokenResponse },
  },
  handler: async (req) => {
    const payload = req.body;

    const result = await cms.service('base::auth::apiToken').create(payload);

    return result;
  },
});
