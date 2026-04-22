import { CreateApiTokenResponse } from '@game-cms/base-core';
import { createApiTokenPayload } from '@game-cms/base-core/schema';
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
  },
  handler: async (req): Promise<CreateApiTokenResponse> => {
    const payload = req.body;

    return cms().service('base::auth::apiToken').create(payload);
  },
});
