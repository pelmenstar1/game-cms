import { GetApiTokenJwtResponse } from '@game-cms/base-core';
import { signTokenInPayload } from '@game-cms/base-core/schema';
import { apiRoute } from '@game-cms/core/api';
import { cms } from '@game-cms/global';

export default apiRoute({
  url: '/auth/token/jwt',
  method: 'POST',
  schema: {
    body: signTokenInPayload,
  },
  handler: async (req): Promise<GetApiTokenJwtResponse> => {
    const { token } = req.body;

    const result = await cms()
      .service('base::auth')
      .signApiTokenIn(token, { signal: req.abortSignal });

    return { jwt: result.token };
  },
});
