import { ApiError, apiRoute } from '@game-cms/utils';
import cookie from 'cookie';
import type { FastifyRequest } from 'fastify';

import { createSessionAuthCookie } from '../../../utils/cookie.js';

function getRefreshToken(req: FastifyRequest) {
  const { cookie: rawCookie } = req.headers;

  if (rawCookie) {
    const cookies = cookie.parse(rawCookie);
    const name = cms.service('base::auth').REFRESH_JWT_COOKIE_NAME;

    return cookies[name];
  }
}

export default apiRoute({
  method: 'POST',
  url: '/auth/user/refresh',
  handler: async (req, res) => {
    const refreshToken = getRefreshToken(req);

    if (!refreshToken) {
      throw new ApiError('No refresh token', 'base::access/unauthorized');
    }

    const userSession = await cms
      .service('base::auth')
      .refreshUserSession(refreshToken);

    const cookie = createSessionAuthCookie(userSession);

    res.status(200).header('set-cookie', cookie);
  },
});
