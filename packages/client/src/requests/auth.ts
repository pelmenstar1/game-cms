import type {
  GetPermissionsResponse,
  SignInPayload,
} from '@game-cms/base-core';
import { json, type RequestContext } from '@game-cms/core/api';

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

export const getSelfPermissions = (context: RequestContext) =>
  request(context, {
    url: '/auth/permissions/self',
    response: json<GetPermissionsResponse>(),
  });
