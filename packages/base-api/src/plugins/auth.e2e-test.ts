import { type CmsFastifyInstance } from '@game-cms/core/api';
import { describe, expect, test } from '@game-cms/e2e';
import { cms, env } from '@game-cms/global';
import { makeRequest } from '@game-cms/testing-lib';
import type { FastifyContextConfig } from 'fastify';

import { initAuth } from './auth.js';

describe('initAuth', () => {
  test('non-protected route', async () => {
    const result = await makeRequest({
      setup: (app) => {
        initAuth(app as unknown as CmsFastifyInstance);
      },
      factory: () => 1,
    });

    expect(result).toEqual(1);
  });

  test('protected route / no auth', async () => {
    await expect(async () => {
      await makeRequest({
        setup: (app) => {
          initAuth(app as unknown as CmsFastifyInstance);
        },
        routeOptions: {
          config: {
            id: 'a$a',
          } as FastifyContextConfig,
        },
        factory: () => 1,
      });
    }).rejects.toBeDefined();
  });

  test('protected route / auth', async () => {
    const { session } = await cms()
      .service('base::auth')
      .signUserIn(env().config.auth.admin);

    const result = await makeRequest({
      setup: (app) => {
        initAuth(app as unknown as CmsFastifyInstance);
      },
      inject: {
        headers: { authorization: `Bearer ${session.token}` },
      },
      routeOptions: {
        config: {
          id: 'a$a',
        } as FastifyContextConfig,
      },
      factory: () => 1,
    });

    expect(result).toBe(1);
  });
});
