import {
  createStandardClient,
  RequestContext,
} from '@game-cms/core/api/client';
import { afterAll, beforeAll, describe } from '@game-cms/e2e';
import { env } from '@game-cms/global';

import { signUserIn } from '../index.js';
import { serverBootstrap } from './serverBootstrap.js';

type ContextRef = { context: RequestContext };

export function describeApiFlow(name: string, fn: (value: ContextRef) => void) {
  describe(name, () => {
    const contextRef = {} as ContextRef;
    let close: () => Promise<void>;

    beforeAll(async () => {
      const { url, close: closeServer } = await serverBootstrap();

      close = closeServer;
      const client = createStandardClient({ baseUrl: `${url}/api` });
      contextRef.context = { client };

      const { email, password } = env().config.auth.admin;
      const { session } = await signUserIn(contextRef.context, {
        email,
        password,
      });

      client.setAuthorizationHeader(`Bearer ${session}`);
    });

    fn(contextRef);

    afterAll(async () => {
      await close();
    });
  });
}
