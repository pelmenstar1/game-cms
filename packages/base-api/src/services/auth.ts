import {
  EntityId,
  ExpirationTimeType,
  Permissions,
  RefreshJwtPayload,
  SessionJwtPayload,
  SignInPayload,
} from '@game-cms/base-core';
import {
  refreshJwtPayloadSchema,
  sessionJwtPayloadSchema,
} from '@game-cms/base-core/schema';
import { service } from '@game-cms/core';
import { ApiError, type ApiRouteId } from '@game-cms/core/api';
import { cms, env } from '@game-cms/global';
import { resolveMaybeFactory } from '@game-cms/shared';
import {
  parseRelativeTimeToTotalSeconds,
  type RelativeTime,
} from '@game-cms/shared/chrono';
import { maybeArrayFlatMap, setAddMany } from '@game-cms/shared/collections';
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
    .setExpirationTime(Math.floor(Date.now() / 1000) + expirationTime)
    .setIssuedAt()
    .sign(getJwtSignKey());

  return { token, expirationTime };
}

async function createSessionToken(
  type: ExpirationTimeType,
  actor: {
    id: ObjectId | string;
    displayName: string;
    permissions: Permissions;
  }
) {
  return createJwtToken<SessionJwtPayload>(type, {
    id: actor.id.toString(),
    name: actor.displayName,
    prms: actor.permissions,
  });
}

async function createRefreshSessionToken(userId: string) {
  return createJwtToken<RefreshJwtPayload>('userRefresh', { userId });
}

function hasPermission(permissions: string[], id: string) {
  return permissions.includes(id);
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
    throw new ApiError(
      'Invalid token payload',
      'base::access/unauthorized',
      null,
      { cause: payloadResult.error }
    );
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

  const result = new Set<ApiRouteId>();

  for (const route of routes) {
    const idFactory = route.config?.id;

    if (idFactory !== undefined) {
      const id = resolveMaybeFactory(idFactory);

      const hydrated = maybeArrayFlatMap(id, (item) =>
        hydratePermission(item, entities)
      );

      if (Array.isArray(hydrated)) {
        setAddMany(result, hydrated);
      } else {
        result.add(hydrated);
      }
    }
  }

  return result;
}

function isValidPermissions(permissions: string[]) {
  const allPermissions = getAllPermissions();

  return permissions.every((name) => allPermissions.has(name));
}

export default service({
  id: 'base::auth',
  getAllPermissions,
  isValidPermissions,
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
      createSessionToken('userSession', {
        id: user.id,
        displayName: user.displayName,
        permissions: user.isAdmin ? '*' : user.permissions,
      }),
      createRefreshSessionToken(user.id.toString()),
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
      throw new ApiError('Token expired', 'base::access/expired');
    }

    return createSessionToken('apiToken', {
      id: tokenInfo._id,
      displayName: tokenInfo.name,
      permissions: tokenInfo.permissions,
    });
  },
  verifySessionJwt: async (token: string, routeId: ApiRouteId | undefined) => {
    try {
      const { id, prms: permissions } = await parseJwtWithSchema(
        token,
        sessionJwtPayloadSchema
      );

      if (
        routeId !== undefined &&
        permissions !== '*' &&
        !hasPermission(permissions, routeId)
      ) {
        throw new ApiError(
          'Cannot access this route',
          'base::access/unauthorized'
        );
      }

      return { actorId: id };
    } catch (error: unknown) {
      if (error instanceof JWTExpired) {
        throw new ApiError('Expired token', 'base::access/expired');
      }

      throw error;
    }
  },
  getSessionInfo: async (token: string) => {
    const { id, prms: permissions } = await parseJwtWithSchema(
      token,
      sessionJwtPayloadSchema
    );

    const resolvedPermissions = permissions.includes('*')
      ? [...getAllPermissions()]
      : (permissions as ApiRouteId[]);

    return { actorId: id, permissions: resolvedPermissions };
  },
});
