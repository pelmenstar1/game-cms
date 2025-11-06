import {
  type CreateApiTokenPayload,
  type CreateApiTokenResponse,
  type DeleteApiTokenPayload,
  type SignInPayload,
  type SignTokenInPayload,
} from '@game-cms/types';

import { jsonInit } from '../requestInitializer.js';
import { json } from '../responseParser.js';
import { request } from '../utils.js';

export const signUserIn = request((payload: SignInPayload) => ({
  path: '/auth/user/signin',
  method: 'POST',
  body: jsonInit(payload),
}));

export const getApiTokenJwt = request((payload: SignTokenInPayload) => ({
  path: `/auth/token/jwt`,
  method: 'POST',
  body: jsonInit(payload),
}));

export const createApiToken = request((payload: CreateApiTokenPayload) => ({
  path: '/auth/token',
  method: 'POST',
  body: jsonInit(payload),
  response: json<CreateApiTokenResponse>(),
}));

export const deleteApiToken = request((payload: DeleteApiTokenPayload) => ({
  path: '/auth/token',
  method: 'DELETE',
  body: jsonInit(payload),
}));
