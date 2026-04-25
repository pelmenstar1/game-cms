import {
  ApiClient,
  createStandardClient,
  RequestOptions,
} from '@game-cms/core/api/client';
import { expect, test } from '@game-cms/e2e';
import { env } from '@game-cms/global';

import {
  getPermissions,
  getSelfSessionInfo,
  refreshUserSession,
  signUserIn,
} from '../../../requests/index.js';
import { describeApiFlow } from '../../apiFlow.js';

describeApiFlow('base auth flow', (contextRef) => {
  test('getSelfSessionInfo returns actorId and permissions', async () => {
    const { context } = contextRef;

    const info = await getSelfSessionInfo(context);

    expect(info.actorId).toBeDefined();
    expect(Array.isArray(info.permissions)).toBe(true);
  });

  test('getPermissions returns permissions list', async () => {
    const { context } = contextRef;

    const { permissions } = await getPermissions(context);

    expect(Array.isArray(permissions)).toBe(true);
  });

  test('refreshUserSession succeeds', async () => {
    const { context } = contextRef;
    const { email, password } = env().config.auth.admin;
    const { session, refresh } = await signUserIn(context, { email, password });

    const inner = createStandardClient({ baseUrl: context.client.baseUrl });
    inner.setAuthorizationHeader(`Bearer ${session}`);

    const cookieClient: ApiClient = {
      baseUrl: inner.baseUrl,
      setAuthorizationHeader: (h) => {
        inner.setAuthorizationHeader(h);
      },
      makeRequest: (options: RequestOptions) => {
        const headers = new Headers(options.headers);
        headers.set('Cookie', `rjwt=${refresh}`);

        return inner.makeRequest({ ...options, headers });
      },
    };

    await refreshUserSession({ client: cookieClient });
  });
});
