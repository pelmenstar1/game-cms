import type z from 'zod';

import type {
  apiToken,
  createApiTokenPayload,
  createApiTokenResponse,
  getApiTokenJwtResponse,
  getPermissionsResponse,
  opaqueApiToken,
  permissionId,
  refreshJwtPayloadSchema,
  sessionJwtPayloadSchema,
  signInPayload,
  signTokenInPayload,
} from './schema/auth.js';

export type OpaqueApiToken = z.infer<typeof opaqueApiToken>;
export type ApiToken = z.infer<typeof apiToken>;

export type PermissionId = z.infer<typeof permissionId>;

export type SignInPayload = z.infer<typeof signInPayload>;
export type SessionJwtPayload = z.infer<typeof sessionJwtPayloadSchema>;
export type RefreshJwtPayload = z.infer<typeof refreshJwtPayloadSchema>;

export type GetApiTokenJwtResponse = z.infer<typeof getApiTokenJwtResponse>;
export type CreateApiTokenPayload = z.infer<typeof createApiTokenPayload>;
export type CreateApiTokenResponse = z.infer<typeof createApiTokenResponse>;
export type SignTokenInPayload = z.infer<typeof signTokenInPayload>;
export type GetPermissionsResponse = z.infer<typeof getPermissionsResponse>;
