import type {
  CreateApiTokenPayload,
  CreateApiTokenResponse,
  DeleteApiTokenPayload,
  GetApiTokenJwtResponse,
  SignInPayload,
  SignTokenInPayload,
} from '@game-cms/types';

import { request } from '../internal/utils.js';
import { jsonInit } from '../requestInitializer.js';
import { json } from '../responseParser.js';

export const signUserIn = request((payload: SignInPayload) => ({
  url: '/auth/user/signin',
  method: 'POST',
  body: jsonInit(payload),
}));

export const getApiTokenJwt = request((payload: SignTokenInPayload) => ({
  url: `/auth/token/jwt`,
  method: 'POST',
  body: jsonInit(payload),
  response: json<GetApiTokenJwtResponse>(),
}));

export const createApiToken = request((payload: CreateApiTokenPayload) => ({
  url: '/auth/token',
  method: 'POST',
  body: jsonInit(payload),
  response: json<CreateApiTokenResponse>(),
}));

export const deleteApiToken = request((payload: DeleteApiTokenPayload) => ({
  url: '/auth/token',
  method: 'DELETE',
  body: jsonInit(payload),
}));
