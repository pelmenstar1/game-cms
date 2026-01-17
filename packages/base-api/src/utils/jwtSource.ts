import cookie from 'cookie';
import type { FastifyRequest } from 'fastify';

export type JwtSourceOptions = {
  cookieName: string;
};

type JwtSource = (
  req: FastifyRequest,
  options: JwtSourceOptions
) => string | undefined;

const AUTH_HEADER_PREFIX = 'Bearer ';

const authHeaderJwtSource: JwtSource = (req) => {
  const { authorization } = req.headers;

  if (authorization?.startsWith(AUTH_HEADER_PREFIX)) {
    return authorization.slice(AUTH_HEADER_PREFIX.length);
  }
};

const cookieJwtSource: JwtSource = (req, options) => {
  const { cookie: rawCookie } = req.headers;

  if (rawCookie !== undefined) {
    const items = cookie.parse(rawCookie);

    return items[options.cookieName];
  }
};

const jwtSources = [authHeaderJwtSource, cookieJwtSource];

export function getRequestJwt(req: FastifyRequest, options: JwtSourceOptions) {
  for (const source of jwtSources) {
    const result = source(req, options);

    if (result !== undefined) {
      return result;
    }
  }
}
