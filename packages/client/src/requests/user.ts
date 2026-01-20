import type {
  CreateUserPayload,
  NoPasswordUser,
  UpdateUserPayload,
} from '@game-cms/base-core';
import { json, type RequestContext } from '@game-cms/core/api';
import type { PageData, PagingOptions } from '@game-cms/shared';

import { request, url } from '../internal/utils.js';
import { jsonInit } from '../requestInitializer.js';

export const createUser = (
  context: RequestContext,
  payload: CreateUserPayload
) =>
  request(context, {
    url: '/user',
    body: jsonInit(payload),
    method: 'POST',
  });

export const listUsers = (context: RequestContext, options: PagingOptions) =>
  request(context, {
    url: url({ path: '/user/list', search: options }),
    response: json<PageData<NoPasswordUser>>(),
  });

export const getUserById = (context: RequestContext, id: string) =>
  request(context, {
    url: `/user/byId/${id}`,
    response: json<NoPasswordUser>(),
  });

export const updateUserById = (
  context: RequestContext,
  id: string,
  payload: UpdateUserPayload
) =>
  request(context, {
    url: `/user/byId/${id}`,
    method: 'PUT',
    body: jsonInit(payload),
  });

export const deleteUserById = (context: RequestContext, id: string) =>
  request(context, {
    url: `/user/byId/${id}`,
    method: 'DELETE',
  });
