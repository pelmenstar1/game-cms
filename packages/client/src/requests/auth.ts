import { type SignInPayload } from '@game-cms/base-types';
import type { RequestContext } from '@game-cms/core';

import { request } from '../internal/utils.js';
import { jsonInit } from '../requestInitializer.js';

export const signUserIn = (context: RequestContext, payload: SignInPayload) =>
  request(context, {
    url: '/auth/user/signin',
    method: 'POST',
    body: jsonInit(payload),
  });

export const refreshUserSession = (context: RequestContext) =>
  request(context, {
    url: '/auth/user/refresh',
    method: 'POST',
  });
