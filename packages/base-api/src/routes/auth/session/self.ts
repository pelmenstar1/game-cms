import { getSessionInfoResponse } from '@game-cms/base-core/schema';
import { ApiError } from '@game-cms/core/api';
import { apiRoute } from '@game-cms/core/api';
import { cms } from '@game-cms/global';

import { SESSION_JWT_COOKIE_NAME } from '../../../utils/authCookie.js';
import { getRequestJwt } from '../../../utils/jwtSource.js';

export default apiRoute({
  url: '/auth/session/self',
  method: 'GET',
  schema: {
    response: {
      200: getSessionInfoResponse,
    },
  },
  handler: async (req) => {
    const authService = cms().service('base::auth');
    const jwt = getRequestJwt(req, { cookieName: SESSION_JWT_COOKIE_NAME });
    if (jwt === undefined) {
      throw new ApiError('No JWT', 'base::access/unauthorized');
    }

    return authService.getSessionInfo(jwt);
  },
});
