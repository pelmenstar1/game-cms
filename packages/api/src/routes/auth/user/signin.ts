import { signInPayload } from '@game-cms/types';
import { apiRoute } from '@game-cms/utils';

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

    const cookieName = cms.service('base::auth').SESSION_JWT_TOKEN_COOKIE_NAME;

    res
      .status(200)
      .header(
        'set-cookie',
        `${cookieName}=${jwt}; HttpOnly; Path=/api; Max-Age=${expirationTime}; SameSite=Strict`
      );
  },
});
