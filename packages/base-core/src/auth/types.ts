import type z from 'zod';

import type {
  apiToken,
  createApiTokenPayload,
  createApiTokenResponse,
  getAllPermissionsResponse,
  getApiTokenJwtResponse,
  getSessionInfoResponse,
  opaqueApiToken,
  opaqueApiTokenWithId,
  permissions,
  refreshJwtPayloadSchema,
  sessionJwtPayloadSchema,
  signInPayload,
  signTokenInPayload,
} from '../schema/auth.js';

export type OpaqueApiToken = z.infer<typeof opaqueApiToken>;
export type OpaqueApiTokenWithId = z.infer<typeof opaqueApiTokenWithId>;
export type ApiToken = z.infer<typeof apiToken>;

export type Permissions = z.infer<typeof permissions>;

export type SignInPayload = z.infer<typeof signInPayload>;
export type SessionJwtPayload = z.infer<typeof sessionJwtPayloadSchema>;
export type RefreshJwtPayload = z.infer<typeof refreshJwtPayloadSchema>;

export type GetApiTokenJwtResponse = z.infer<typeof getApiTokenJwtResponse>;
export type CreateApiTokenPayload = z.infer<typeof createApiTokenPayload>;
export type CreateApiTokenResponse = z.infer<typeof createApiTokenResponse>;
export type SignTokenInPayload = z.infer<typeof signTokenInPayload>;
export type GetAllPermissionsResponse = z.infer<
  typeof getAllPermissionsResponse
>;
export type GetSessionInfoResponse = z.infer<typeof getSessionInfoResponse>;
