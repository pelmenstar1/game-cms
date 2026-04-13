import {
  createStandardClient,
  RequestContext,
  StandardClientOptions,
} from '@game-cms/core/api/client';

import { getApiTokenJwt } from './requests/auth/apiToken.js';

export interface StandardClientWithApiTokenOptions extends StandardClientOptions {
  apiToken: string;
}

export async function createStandardClientWithApiToken({
  baseUrl,
  apiToken,
}: StandardClientWithApiTokenOptions) {
  const client = createStandardClient({ baseUrl });
  const context: RequestContext = { client };

  const { jwt } = await getApiTokenJwt(context, { token: apiToken });
  client.setAuthorizationHeader(`Bearer ${jwt}`);

  return client;
}
