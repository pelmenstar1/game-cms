import type {
  GetAllPermissionsResponse,
  GetSessionInfoResponse,
  SignInPayload,
} from '@game-cms/base-core';
import { json, type RequestContext } from '@game-cms/core/api';

import { jsonInit } from '../requestInitializer.js';
import { request } from '../utils.js';

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

export const getSelfSessionInfo = (context: RequestContext) =>
  request(context, {
    url: '/auth/session/self',
    response: json<GetSessionInfoResponse>(),
  });

export const getPermissions = (context: RequestContext) =>
  request(context, {
    url: '/auth/permissions',
    response: json<GetAllPermissionsResponse>(),
  });
