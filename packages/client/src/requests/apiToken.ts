import type {
  CreateApiTokenPayload,
  CreateApiTokenResponse,
  GetApiTokenJwtResponse,
  OpaqueApiToken,
  OpaqueApiTokenWithId,
  SignTokenInPayload,
} from '@game-cms/base-core';
import type { ToClientType } from '@game-cms/core';
import { json, type RequestContext } from '@game-cms/core/api';
import type { PageData, PagingOptions } from '@game-cms/shared';

import { url } from '../internal/utils.js';
import { jsonInit } from '../requestInitializer.js';
import { request } from '../utils.js';

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
    response: json<ToClientType<PageData<OpaqueApiTokenWithId>>>(),
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
