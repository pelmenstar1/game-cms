import { GetSessionInfoResponse } from '@game-cms/base-core';
import { apiRoute } from '@game-cms/core/api';
import { cms } from '@game-cms/global';

import { SESSION_JWT_COOKIE_NAME } from '../../../utils/authCookie.js';
import { getRequestJwt } from '../../../utils/jwtSource.js';

export default apiRoute({
  url: '/auth/session/self',
  method: 'GET',
  handler: async (req): Promise<GetSessionInfoResponse> => {
    const authService = cms().service('base::auth');
    const jwt = getRequestJwt(req, { cookieName: SESSION_JWT_COOKIE_NAME });

    return authService.getSessionInfo(jwt);
  },
});
