import type {
  CreateApiTokenPayload,
  CreateApiTokenResponse,
  DeleteApiTokenPayload,
  GetApiTokenJwtResponse,
  GetPermissionsResponse,
  SignInPayload,
  SignTokenInPayload,
} from '@game-cms/base-types';

import { request } from '../internal/utils.js';
import { jsonInit } from '../requestInitializer.js';
import { json } from '../responseParser.js';
import type { RequestContext } from '../types.js';

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

export const getApiTokenJwt = (
  context: RequestContext,
  payload: SignTokenInPayload
) =>
  request(context, {
    url: `/auth/token/jwt`,
    method: 'POST',
    body: jsonInit(payload),
    response: json<GetApiTokenJwtResponse>(),
  });

export const createApiToken = (
  context: RequestContext,
  payload: CreateApiTokenPayload
) =>
  request(context, {
    url: '/auth/token',
    method: 'POST',
    body: jsonInit(payload),
    response: json<CreateApiTokenResponse>(),
  });

export const deleteApiToken = (
  context: RequestContext,
  payload: DeleteApiTokenPayload
) =>
  request(context, {
    url: '/auth/token',
    method: 'DELETE',
    body: jsonInit(payload),
  });

export const getPermissions = (context: RequestContext) =>
  request(context, {
    url: '/auth/permissions',
    response: json<GetPermissionsResponse>(),
  });
