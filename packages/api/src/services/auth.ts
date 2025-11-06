import { env } from '@game-cms/env';
import { ApiError, ApiErrorCode } from '@game-cms/shared-api';
import {
  type ApiRouteId,
  type JwtPayload,
  jwtPayloadSchema,
  type SignInPayload,
} from '@game-cms/types';
import { service } from '@game-cms/utils';
import { jwtVerify, SignJWT } from 'jose';
import type { ObjectId } from 'mongodb';

import { verifyPassword } from '../utils/password.js';

const DEFAULT_USER_EXPIRATION_TIME = '7W';
const DEFAULT_API_TOKEN_EXPIRATION_TIME = '2h';

const SESSION_JWT_TOKEN_COOKIE_NAME = 'sjwt';

function getJwtSignKey() {
  const key = env().config.auth.jwtSignKey;

  if (typeof key === 'string') {
    return Buffer.from(key, 'utf8');
  }

  return key;
}

function createJwtToken(
  actor: { _id: ObjectId | string; name: string; permissions: string[] },
  expirationTime: string | number
) {
  const payload: JwtPayload = {
    id: actor._id.toString(),
    name: actor.name,
    prms: actor.permissions,
  };

  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(expirationTime)
    .setIssuedAt()
    .sign(getJwtSignKey());
}

function hasPermission(permissions: string[], id: string) {
  return permissions.includes('*') || permissions.includes(id);
}

export default service({
  id: 'base::auth',
  SESSION_JWT_TOKEN_COOKIE_NAME,
  signUserIn: async (payload: SignInPayload) => {
    const user = await cms
      .service('base::user')
      .fullGetBy({ email: payload.email });

    const isValid = user
      ? await verifyPassword(user.passwordHash, payload.password)
      : false;

    if (user === null || !isValid) {
      throw new ApiError('Invalid user or password', ApiErrorCode.UNAUTHORIZED);
    }

    const expirationTime =
      env().config.auth.expirationTimes?.user ?? DEFAULT_USER_EXPIRATION_TIME;

    const jwt = await createJwtToken(user, expirationTime);

    return { jwt, expirationTime };
  },
  signApiTokenIn: async (token: string) => {
    const tokenInfo = await cms.service('base::auth::apiToken').get(token);
    if (tokenInfo === null) {
      throw new ApiError('Unknown token', ApiErrorCode.UNAUTHORIZED);
    }

    const now = Date.now();

    if (now > tokenInfo.expirationDate.getTime()) {
      throw new ApiError(`Token expired`, ApiErrorCode.UNAUTHORIZED);
    }

    const jwtExpirationTime =
      env().config.auth.expirationTimes?.user ??
      DEFAULT_API_TOKEN_EXPIRATION_TIME;

    const jwt = await createJwtToken(
      {
        _id: 'API token',
        name: tokenInfo.name,
        permissions: tokenInfo.permissions,
      },
      jwtExpirationTime
    );

    return { jwt };
  },
  verifyJwt: async (token: string, routeId: ApiRouteId | undefined) => {
    const { payload } = await jwtVerify(token, getJwtSignKey());

    const payloadResult = jwtPayloadSchema.safeParse(payload);
    if (!payloadResult.success) {
      throw new ApiError(
        'Invalid token payload',
        ApiErrorCode.VALIDATION_ISSUE
      );
    }

    const permissions = payloadResult.data.prms;

    if (routeId !== undefined && !hasPermission(permissions, routeId)) {
      throw new ApiError('Cannot access this route', ApiErrorCode.UNAUTHORIZED);
    }
  },
});
