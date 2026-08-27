import { stringifySetCookie } from 'cookie';

import type { JwtResult } from '../services/auth.js';

export const SESSION_JWT_COOKIE_NAME = 'sjwt';
export const REFRESH_JWT_COOKIE_NAME = 'rjwt';

export function createSessionAuthCookie(info: JwtResult) {
  return stringifySetCookie({
    name: SESSION_JWT_COOKIE_NAME,
    value: info.token,
    httpOnly: true,
    path: '/api',
    maxAge: info.expirationTime,
    sameSite: 'strict',
  });
}

export function createRefreshAuthCookie(info: JwtResult) {
  return stringifySetCookie({
    name: REFRESH_JWT_COOKIE_NAME,
    value: info.token,
    httpOnly: true,
    path: '/api/auth/user/refresh',
    maxAge: info.expirationTime,
    sameSite: 'strict',
  });
}
