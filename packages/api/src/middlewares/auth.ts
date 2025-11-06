import type { IncomingHttpHeaders } from 'node:http';

import { getCookieValue } from '@game-cms/shared/http';
import { ApiError, ApiErrorCode } from '@game-cms/shared-api';
import { type ApiRouteContextConfig, type ApiRouteId } from '@game-cms/types';
import type {
  preHandlerAsyncHookHandler,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerBase,
  RawServerDefault,
  RouteGenericInterface,
} from 'fastify';

import { parseApiRouteId } from '../utils/routeId.js';

const AUTH_HEADER_PREFIX = 'Bearer ';

function getJwt(headers: IncomingHttpHeaders) {
  const { authorization, cookie } = headers;

  if (authorization?.startsWith(AUTH_HEADER_PREFIX)) {
    return authorization.slice(AUTH_HEADER_PREFIX.length);
  }

  const key = cms.service('base::auth').SESSION_JWT_TOKEN_COOKIE_NAME;

  return cookie ? getCookieValue(cookie, key) : undefined;
}

function hydrateRouteId(id: ApiRouteId, params: unknown): ApiRouteId {
  const { namespace, action } = parseApiRouteId(id);

  const entries =
    typeof params === 'object' && params !== null ? Object.entries(params) : [];

  let newNamespace = namespace;

  for (const [key, value] of entries) {
    newNamespace = newNamespace.replace(`[${key}]`, String(value));
  }

  return `${newNamespace}$${action}`;
}

export function authHandler<
  RawServer extends RawServerBase = RawServerDefault,
  RawReply extends
    RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>,
  RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
>(): preHandlerAsyncHookHandler<
  RawServer,
  RawRequestDefaultExpression<RawServer>,
  RawReply,
  RouteGeneric,
  ApiRouteContextConfig
> {
  return async (req) => {
    const token = getJwt(req.headers);
    if (token === undefined) {
      throw new ApiError('No JWT', ApiErrorCode.UNAUTHORIZED);
    }

    const { id } = req.routeOptions.config;
    const hydratedId = id ? hydrateRouteId(id, req.params) : id;

    await cms.service('base::auth').verifyJwt(token, hydratedId);
  };
}
