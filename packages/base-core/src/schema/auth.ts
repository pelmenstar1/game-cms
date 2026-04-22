import { apiRouteId } from '@game-cms/core/schema';
import { objectId } from '@game-cms/shared/mongo';
import z from 'zod';

export const permissions = z.union([z.literal('*'), z.array(apiRouteId)]);

export const signInPayload = z.object({
  email: z.string(),
  password: z.string(),
});

export const sessionJwtPayloadSchema = z.object({
  id: z.string(),
  name: z.string(),
  prms: permissions,
});

export const refreshJwtPayloadSchema = z.object({
  userId: z.string(),
});

export const opaqueApiToken = z.object({
  name: z.string(),
  expirationDate: z.instanceof(Date),
  permissions: z.array(apiRouteId),
});

export const opaqueApiTokenWithId = z.object({
  ...opaqueApiToken.shape,
  id: objectId,
});

export const apiToken = z.object({
  ...opaqueApiToken.shape,
  token: z.string(),
});

export const createApiTokenPayload = z.object({
  name: z.string(),
  expirationTime: z.number(),
  permissions: z.array(apiRouteId),
});

export const signTokenInPayload = z.object({
  token: z.string(),
});
