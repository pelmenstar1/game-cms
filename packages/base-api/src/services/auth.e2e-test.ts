import { ApiError } from '@game-cms/base-core';
import type { ApiRouteId } from '@game-cms/core/api';
import { cms } from '@game-cms/global';
import { describe, expect, it } from 'vitest';

describe('signUserIn', () => {
  it('should successfully login with valid credentials', async () => {
    const userService = cms().service('base::user');
    const authService = cms().service('base::auth');

    const email = 'test@example.com';
    const password = 'testPassword123';
    const displayName = 'Test User';
    const permissions: ApiRouteId[] = ['storage$list'];

    const { id } = await userService.create({
      email,
      password,
      displayName,
      permissions,
    });

    const { session, refresh } = await authService.signUserIn({
      email,
      password,
    });

    expect(session.token).toBeDefined();
    expect(session.expirationTime).toBeGreaterThan(0);
    expect(refresh.token).toBeDefined();
    expect(refresh.expirationTime).toBeGreaterThan(0);

    await userService.delete(id);
  });

  it('should throw error with invalid email', async () => {
    const authService = cms().service('base::auth');

    await expect(
      authService.signUserIn({
        email: 'nonexistent@example.com',
        password: 'anyPassword',
      })
    ).rejects.toThrow(ApiError);
  });

  it('should throw error with invalid password', async () => {
    const userService = cms().service('base::user');
    const authService = cms().service('base::auth');

    const email = 'test2@example.com';
    const password = 'correctPassword';

    const { id } = await userService.create({
      email,
      password,
      displayName: 'Test User 2',
      permissions: [],
    });

    await expect(
      authService.signUserIn({
        email,
        password: 'wrongPassword',
      })
    ).rejects.toThrow(ApiError);

    await userService.delete(id);
  });
});

describe('refreshUserSession', () => {
  it('should successfully refresh session with valid token', async () => {
    const userService = cms().service('base::user');
    const authService = cms().service('base::auth');

    const email = 'test3@example.com';
    const password = 'testPassword123';

    const { id } = await userService.create({
      email,
      password,
      displayName: 'Test User 3',
      permissions: ['storage$list'],
    });

    const { refresh } = await authService.signUserIn({ email, password });

    const newSession = await authService.refreshUserSession(refresh.token);

    expect(newSession.token).toBeDefined();
    expect(newSession.expirationTime).toBeGreaterThan(0);

    await userService.delete(id);
  });

  it('should throw error with invalid token', async () => {
    const authService = cms().service('base::auth');

    await expect(
      authService.refreshUserSession('invalid.token.here')
    ).rejects.toThrow();
  });
});

describe('signApiTokenIn', () => {
  it('should successfully login with valid API token', async () => {
    const apiTokenService = cms().service('base::auth::apiToken');
    const authService = cms().service('base::auth');

    const name = 'API Token Test';
    const permissions: ApiRouteId[] = ['storage$list'];

    const { id, token } = await apiTokenService.create({
      name,
      permissions,
      expirationTime: 3600,
    });

    const session = await authService.signApiTokenIn(token);

    expect(session.token).toBeDefined();
    expect(session.expirationTime).toBeGreaterThan(0);

    await apiTokenService.deleteById(id);
  });

  it('should throw error with unknown token', async () => {
    const authService = cms().service('base::auth');

    await expect(
      authService.signApiTokenIn('nonexistent-token-12345')
    ).rejects.toThrow(ApiError);
  });

  it('should throw error with expired token', async () => {
    const apiTokenService = cms().service('base::auth::apiToken');
    const authService = cms().service('base::auth');

    const name = 'Expired Token';
    const permissions: ApiRouteId[] = ['storage$list'];

    const { id, token } = await apiTokenService.create({
      name,
      permissions,
      expirationTime: -1,
    });

    await expect(authService.signApiTokenIn(token)).rejects.toThrow(ApiError);

    await apiTokenService.deleteById(id);
  });
});

describe('verifySessionJwt', () => {
  it('should verify valid session without route check', async () => {
    const userService = cms().service('base::user');
    const authService = cms().service('base::auth');

    const email = 'test4@example.com';
    const password = 'testPassword123';

    const { id } = await userService.create({
      email,
      password,
      displayName: 'Test User 4',
      permissions: ['storage$list'],
    });

    const { session } = await authService.signUserIn({ email, password });

    await expect(
      authService.verifySessionJwt(session.token, undefined)
    ).resolves.not.toThrow();

    await userService.delete(id);
  });

  it('should verify valid session with permitted route', async () => {
    const userService = cms().service('base::user');
    const authService = cms().service('base::auth');

    const email = 'test5@example.com';
    const password = 'testPassword123';
    const routeId: ApiRouteId = 'storage$list';

    const { id } = await userService.create({
      email,
      password,
      displayName: 'Test User 5',
      permissions: [routeId],
    });

    const { session } = await authService.signUserIn({ email, password });

    await expect(
      authService.verifySessionJwt(session.token, routeId)
    ).resolves.not.toThrow();

    await userService.delete(id);
  });

  it('should throw error when accessing unauthorized route', async () => {
    const userService = cms().service('base::user');
    const authService = cms().service('base::auth');

    const email = 'test6@example.com';
    const password = 'testPassword123';
    const allowedRoute: ApiRouteId = 'storage$list';
    const forbiddenRoute: ApiRouteId = 'user$create';

    const { id } = await userService.create({
      email,
      password,
      displayName: 'Test User 6',
      permissions: [allowedRoute],
    });

    const { session } = await authService.signUserIn({ email, password });

    await expect(
      authService.verifySessionJwt(session.token, forbiddenRoute)
    ).rejects.toThrow(ApiError);

    await userService.delete(id);
  });

  it('should grant all access with wildcard permissions', async () => {
    const userService = cms().service('base::user');
    const authService = cms().service('base::auth');

    const email = 'test7@example.com';
    const password = 'testPassword123';

    const { id } = await userService.create({
      email,
      password,
      displayName: 'Admin User',
      permissions: ['*'],
    });

    const { session } = await authService.signUserIn({ email, password });

    await expect(
      authService.verifySessionJwt(session.token, 'storage$list')
    ).resolves.not.toThrow();

    await userService.delete(id);
  });
});

describe('getSessionPermissions', () => {
  it('should return permissions from token', async () => {
    const userService = cms().service('base::user');
    const authService = cms().service('base::auth');

    const email = 'test8@example.com';
    const password = 'testPassword123';
    const permissions: ApiRouteId[] = ['storage$list', 'user$byId$get'];

    const { id } = await userService.create({
      email,
      password,
      displayName: 'Test User 8',
      permissions,
    });

    const { session } = await authService.signUserIn({ email, password });

    const sessionPermissions = await authService.getSessionPermissions(
      session.token
    );

    expect(sessionPermissions).toEqual(permissions);

    await userService.delete(id);
  });

  it('should return all permissions with wildcard', async () => {
    const userService = cms().service('base::user');
    const authService = cms().service('base::auth');

    const email = 'test9@example.com';
    const password = 'testPassword123';

    const { id } = await userService.create({
      email,
      password,
      displayName: 'Admin User 2',
      permissions: ['*'],
    });

    const { session } = await authService.signUserIn({ email, password });

    const sessionPermissions = await authService.getSessionPermissions(
      session.token
    );

    expect(sessionPermissions).toEqual(authService.getAllPermissions());

    await userService.delete(id);
  });
});

describe('getAllPermissions', () => {
  it('should return list of available permissions', () => {
    const authService = cms().service('base::auth');

    const permissions = authService.getAllPermissions();

    // Check that permissions are hydrated
    expect(permissions.every((value) => !/\[.+\]/.test(value))).toBe(true);
  });
});
