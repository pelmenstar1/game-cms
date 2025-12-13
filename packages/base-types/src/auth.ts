import type z from 'zod';

import type {
  createApiTokenPayload,
  createApiTokenResponse,
  deleteApiTokenPayload,
  getApiTokenJwtResponse,
  getPermissionsResponse,
  refreshJwtPayloadSchema,
  sessionJwtPayloadSchema,
  signInPayload,
  signTokenInPayload,
} from './schema/auth.js';

export type SignInPayload = z.infer<typeof signInPayload>;
export type SessionJwtPayload = z.infer<typeof sessionJwtPayloadSchema>;
export type RefreshJwtPayload = z.infer<typeof refreshJwtPayloadSchema>;

export type ApiToken = {
  token: string;
  name: string;
  expirationDate: Date;
  permissions: string[];
};

export type GetApiTokenJwtResponse = z.infer<typeof getApiTokenJwtResponse>;
export type CreateApiTokenPayload = z.infer<typeof createApiTokenPayload>;
export type CreateApiTokenResponse = z.infer<typeof createApiTokenResponse>;
export type SignTokenInPayload = z.infer<typeof signTokenInPayload>;
export type DeleteApiTokenPayload = z.infer<typeof deleteApiTokenPayload>;
export type GetPermissionsResponse = z.infer<typeof getPermissionsResponse>;
