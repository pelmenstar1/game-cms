import type {
  CreateApiTokenPayload,
  CreateApiTokenResponse,
  GetApiTokenJwtResponse,
  GetPermissionsResponse,
  OpaqueApiToken,
  SignTokenInPayload,
} from '@game-cms/base-types';
import type { PageData, PagingOptions } from '@game-cms/shared';
import type { ToClientType } from '@game-cms/types';

import { request, url } from '../internal/utils.js';
import { jsonInit } from '../requestInitializer.js';
import { json } from '../responseParser.js';
import type { RequestContext } from '../types.js';

export const getApiTokenJwt = (
  context: RequestContext,
  payload: SignTokenInPayload
) =>
  request(context, {
    url: '/auth/token/jwt',
    method: 'POST',
    body: jsonInit(payload),
    response: json<GetApiTokenJwtResponse>(),
  });

export const getApiTokenInfo = (context: RequestContext, id: string) =>
  request(context, {
    url: `/auth/token/byId/${id}`,
    response: json<ToClientType<OpaqueApiToken>>(),
  });

export const listApiTokens = (
  context: RequestContext,
  options: PagingOptions
) =>
  request(context, {
    url: url({
      path: '/auth/token/list',
      search: options,
    }),
    response: json<ToClientType<PageData<OpaqueApiToken>>>(),
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

export const deleteApiToken = (context: RequestContext, id: string) =>
  request(context, {
    url: `/auth/token/byId/${id}`,
    method: 'DELETE',
  });

export const getPermissions = (context: RequestContext) =>
  request(context, {
    url: '/auth/permissions',
    response: json<GetPermissionsResponse>(),
  });
