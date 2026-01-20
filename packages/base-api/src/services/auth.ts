import {
  ApiError,
  type EntityId,
  type ExpirationTimeType,
  type PermissionId,
  type RefreshJwtPayload,
  type SessionJwtPayload,
  type SignInPayload,
} from '@game-cms/base-core';
import {
  refreshJwtPayloadSchema,
  sessionJwtPayloadSchema,
} from '@game-cms/base-core/schema';
import { service } from '@game-cms/core';
import type { ApiRouteId } from '@game-cms/core/api';
import { cms, env } from '@game-cms/global';
import {
  parseRelativeTimeToTotalSeconds,
  type RelativeTime,
} from '@game-cms/shared/chrono';
import { type JWTPayload, jwtVerify, SignJWT } from 'jose';
import { JWTExpired } from 'jose/errors';
import { ObjectId } from 'mongodb';
import type { ZodType } from 'zod';

import { verifyPassword } from '../utils/password.js';

export type JwtResult = { token: string; expirationTime: number };

const defaultExpirationTimes: Record<ExpirationTimeType, RelativeTime> = {
  userSession: '15m',
  userRefresh: '1w',
  apiToken: '2h',
};

function getJwtSignKey() {
  const key = env().config.auth.jwtSignKey;

  if (typeof key === 'string') {
    return Buffer.from(key, 'utf8');
  }

  return key;
}

// For better type inference
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
async function createJwtToken<T extends JWTPayload>(
  type: ExpirationTimeType,
  payload: T
) {
  const expirationTime = getExpirationTime(type);

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(Date.now() / 1000 + expirationTime)
    .setIssuedAt()
    .sign(getJwtSignKey());

  return { token, expirationTime };
}

async function createSessionToken(
  type: ExpirationTimeType,
  actor: {
    _id: ObjectId | string;
    displayName: string;
    permissions: PermissionId[];
  }
) {
  return createJwtToken<SessionJwtPayload>(type, {
    id: actor._id.toString(),
    name: actor.displayName,
    prms: actor.permissions,
  });
}

async function createRefreshSessionToken(userId: string) {
  return createJwtToken<RefreshJwtPayload>('userRefresh', { userId });
}

function hasPermission(permissions: string[], id: string) {
  return permissions.includes('*') || permissions.includes(id);
}

function getExpirationTime(key: ExpirationTimeType) {
  const raw =
    env().config.auth.expirationTimes?.[key] ?? defaultExpirationTimes[key];

  return typeof raw === 'string' ? parseRelativeTimeToTotalSeconds(raw) : raw;
}

async function parseJwtWithSchema<T>(token: string, schema: ZodType<T>) {
  const { payload } = await jwtVerify(token, getJwtSignKey());

  const payloadResult = schema.safeParse(payload);
  if (!payloadResult.success) {
    throw new ApiError('Invalid token payload', 'base::access/unauthorized');
  }

  return payloadResult.data;
}

function hydratePermission(routeId: ApiRouteId, entities: EntityId[]) {
  if (routeId.includes('[entityId]')) {
    return entities.map(
      (entityName) =>
        routeId.replaceAll('[entityId]', entityName.toString()) as ApiRouteId
    );
  }

  return routeId;
}

function getAllPermissions() {
  const entities = cms()
    .service('base::entitySchema')
    .getAll()
    .map((schema) => schema.id);

  const { routes } = env().api;

  const result = routes
    .map((route) => route.config?.id)
    .filter((id) => id !== undefined)
    .flatMap((permission) => hydratePermission(permission, entities));

  return [...new Set(result)];
}

export default service({
  id: 'base::auth',
  getAllPermissions,
  signUserIn: async (payload: SignInPayload) => {
    const user = await cms()
      .service('base::user')
      .fullGetBy({ email: payload.email });

    const isValid = user
      ? await verifyPassword(user.passwordHash, payload.password)
      : false;

    if (user === null || !isValid) {
      throw new ApiError(
        'Invalid user or password',
        'base::access/unauthorized'
      );
    }

    const [session, refresh] = await Promise.all([
      createSessionToken('userSession', user),
      createRefreshSessionToken(user._id.toString()),
    ]);

    return { session, refresh };
  },
  refreshUserSession: async (token: string) => {
    const { userId } = await parseJwtWithSchema(token, refreshJwtPayloadSchema);

    const user = await cms()
      .service('base::user')
      .getById(new ObjectId(userId));

    if (user === null) {
      throw new ApiError('Unknown user', 'base::entity/notFound');
    }

    return createSessionToken('userSession', user);
  },
  signApiTokenIn: async (token: string) => {
    const tokenInfo = await cms()
      .service('base::auth::apiToken')
      .getByToken(token);

    if (tokenInfo === null) {
      throw new ApiError('Unknown token', 'base::access/unauthorized');
    }

    const now = Date.now();

    if (now > tokenInfo.expirationDate.getTime()) {
      throw new ApiError(`Token expired`, 'base::access/expired');
    }

    return createSessionToken('apiToken', {
      _id: 'API token',
      displayName: tokenInfo.name,
      permissions: tokenInfo.permissions,
    });
  },
  verifySessionJwt: async (token: string, routeId: ApiRouteId | undefined) => {
    try {
      const { prms: permissions } = await parseJwtWithSchema(
        token,
        sessionJwtPayloadSchema
      );

      if (routeId !== undefined && !hasPermission(permissions, routeId)) {
        throw new ApiError(
          'Cannot access this route',
          'base::access/unauthorized'
        );
      }
    } catch (error: unknown) {
      if (error instanceof JWTExpired) {
        throw new ApiError('Expired token', 'base::access/expired');
      }

      throw error;
    }
  },
  getSessionPermissions: async (token: string) => {
    const { prms: permissions } = await parseJwtWithSchema(
      token,
      sessionJwtPayloadSchema
    );

    if (permissions.includes('*')) {
      return getAllPermissions();
    }

    return permissions as ApiRouteId[];
  },
});
