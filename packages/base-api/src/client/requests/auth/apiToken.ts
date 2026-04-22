import type {
  CreateApiTokenPayload,
  CreateApiTokenResponse,
  GetApiTokenJwtResponse,
  OpaqueApiToken,
  OpaqueApiTokenWithId,
  SignTokenInPayload,
} from '@game-cms/base-core';
import type { ToClientType } from '@game-cms/core';
import {
  json,
  jsonInit,
  request,
  RequestContext,
  url,
} from '@game-cms/core/api/client';
import type { PageData, PagingOptions } from '@game-cms/shared';

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
    url: `/auth/token/${id}`,
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
    url: `/auth/token/${id}`,
    method: 'DELETE',
  });
