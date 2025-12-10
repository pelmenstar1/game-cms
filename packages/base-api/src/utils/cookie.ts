import { serialize } from 'cookie';

import type { JwtResult } from '../services/auth.js';

export function createSessionAuthCookie(info: JwtResult) {
  const cookieName = cms.service('base::auth').SESSION_JWT_COOKIE_NAME;

  return serialize(cookieName, info.token, {
    httpOnly: true,
    path: '/api',
    maxAge: info.expirationTime,
    sameSite: 'strict',
  });
}

export function createRefreshAuthCookie(info: JwtResult) {
  const cookieName = cms.service('base::auth').REFRESH_JWT_COOKIE_NAME;

  return serialize(cookieName, info.token, {
    httpOnly: true,
    path: '/api/auth/user/refresh',
    maxAge: info.expirationTime,
    sameSite: 'strict',
  });
}
