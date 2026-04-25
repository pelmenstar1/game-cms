import { ApiRouteId } from '@game-cms/core/api';
import { createStandardClient } from '@game-cms/core/api/client';
import { expect, test } from '@game-cms/e2e';

import {
  createApiToken,
  deleteApiToken,
  getApiTokenInfo,
  getApiTokenJwt,
  getSelfSessionInfo,
} from '../../../requests/index.js';
import { describeApiFlow } from '../../apiFlow.js';

describeApiFlow('api token flow', (contextRef) => {
  test('token flow', async () => {
    const { context } = contextRef;

    const name = 'Token 1';
    const permissions: ApiRouteId[] = ['storage$list'];

    const { id, token } = await createApiToken(context, {
      name,
      permissions,
      expirationTime: 100,
    });

    const dbInfo = await getApiTokenInfo(context, id);

    expect(dbInfo).toMatchObject({ name, permissions });

    const { jwt } = await getApiTokenJwt(context, { token });

    expect(jwt).toBeDefined();

    await deleteApiToken(context, id);

    await expect(() => getApiTokenInfo(context, id)).rejects.toBeDefined();
  });

  test('expired token cannot be used', async () => {
    const { context } = contextRef;

    const name = 'Expiring Token';
    const permissions: ApiRouteId[] = ['storage$list'];

    const { token } = await createApiToken(context, {
      name,
      permissions,
      expirationTime: 1, // 1 second
    });

    const { jwt } = await getApiTokenJwt(context, { token });

    expect(jwt).toBeDefined();

    // Wait for token to expire
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Attempt to use expired token
    const expiredClient = createStandardClient({
      baseUrl: context.client.baseUrl,
    });

    expiredClient.setAuthorizationHeader(`Bearer ${jwt}`);

    await expect(() =>
      getSelfSessionInfo({ client: expiredClient })
    ).rejects.toBeDefined();
  });
});
