import { signInPayload } from '@game-cms/types';
import { apiRoute } from '@game-cms/utils';

import { SESSION_JWT_TOKEN_COOKIE_NAME } from '../../../utils/auth.js';

export default apiRoute({
  url: '/auth/user/signin',
  method: 'POST',
  schema: {
    body: signInPayload,
  },
  handler: async (req, res) => {
    const payload = req.body;

    const { jwt, expirationTime } = await cms
      .service('base::auth')
      .signUserIn(payload);

    res
      .status(200)
      .header(
        'set-cookie',
        `${SESSION_JWT_TOKEN_COOKIE_NAME}=${jwt}; HttpOnly; Path=/api; Max-Age=${expirationTime}; SameSite=Strict`
      );
  },
});
