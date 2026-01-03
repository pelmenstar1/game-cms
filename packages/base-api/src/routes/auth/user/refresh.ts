import { ApiError } from '@game-cms/base-utils';
import { apiRoute } from '@game-cms/core';
import { cms } from '@game-cms/global';
import cookie from 'cookie';
import type { FastifyRequest } from 'fastify';

import { REFRESH_JWT_COOKIE_NAME } from '../../../utils/authCookie.js';
import { createSessionAuthCookie } from '../../../utils/authCookie.js';

function getRefreshToken(req: FastifyRequest) {
  const { cookie: rawCookie } = req.headers;

  if (rawCookie) {
    const cookies = cookie.parse(rawCookie);

    return cookies[REFRESH_JWT_COOKIE_NAME];
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

    const userSession = await cms()
      .service('base::auth')
      .refreshUserSession(refreshToken);

    const cookie = createSessionAuthCookie(userSession);

    res.status(200).header('set-cookie', cookie);
  },
});
