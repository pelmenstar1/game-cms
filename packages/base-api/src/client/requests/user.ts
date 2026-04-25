import type {
  CreateUserPayload,
  CreateUserResponse,
  NoPasswordUser,
  UpdateUserPayload,
} from '@game-cms/base-core';
import { ToClientType } from '@game-cms/core';
import {
  json,
  jsonInit,
  request,
  RequestContext,
  url,
} from '@game-cms/core/api/client';
import type { PageData, PagingOptions } from '@game-cms/shared';

export const createUser = (
  context: RequestContext,
  payload: CreateUserPayload
) =>
  request(context, {
    url: '/user',
    body: jsonInit(payload),
    method: 'POST',
    response: json<ToClientType<CreateUserResponse>>(),
  });

export const listUsers = (context: RequestContext, options: PagingOptions) =>
  request(context, {
    url: url({ path: '/user/list', search: options }),
    response: json<PageData<NoPasswordUser>>(),
  });

export const getUserById = (context: RequestContext, id: string) =>
  request(context, {
    url: `/user/${id}`,
    response: json<NoPasswordUser>(),
  });

export const updateUserById = (
  context: RequestContext,
  id: string,
  payload: UpdateUserPayload
) =>
  request(context, {
    url: `/user/${id}`,
    method: 'PUT',
    body: jsonInit(payload),
  });

export const deleteUserById = (context: RequestContext, id: string) =>
  request(context, {
    url: `/user/${id}`,
    method: 'DELETE',
  });
