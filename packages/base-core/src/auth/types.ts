import { ApiRouteId } from '@game-cms/core/api';
import type z from 'zod';

import type {
  apiToken,
  createApiTokenPayload,
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

export type GetApiTokenJwtResponse = {
  jwt: string;
};

export type CreateApiTokenPayload = z.infer<typeof createApiTokenPayload>;

export type CreateApiTokenResponse = {
  token: string;
};

export type SignTokenInPayload = z.infer<typeof signTokenInPayload>;

export type GetAllPermissionsResponse = {
  permissions: ApiRouteId[];
};

export type GetSessionInfoResponse = {
  actorId: string;
  permissions: ApiRouteId[];
};
