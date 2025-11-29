import { signInPayload } from '@game-cms/base-types';
import { apiRoute } from '@game-cms/utils';
import cookie from 'cookie';

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

    const encodedCookie = cookie.serialize(cookieName, jwt, {
      httpOnly: true,
      path: '/api',
      maxAge: expirationTime,
      sameSite: 'strict',
    });

    res.status(200).header('set-cookie', encodedCookie);
  },
});
