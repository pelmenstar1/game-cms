import z from 'zod';

export const signInPayload = z.object({
  email: z.string(),
  password: z.string(),
});

export const sessionJwtPayloadSchema = z.object({
  id: z.string(),
  name: z.string(),
  prms: z.array(z.string()), // permissions
});

export const refreshJwtPayloadSchema = z.object({
  userId: z.string(),
});

export const createApiTokenPayload = z.object({
  name: z.string(),
  expirationTime: z.number(),
  permissions: z.array(z.string()),
});

export const getApiTokenJwtResponse = z.object({
  jwt: z.string(),
});

export const createApiTokenResponse = z.object({
  token: z.string(),
});

export const signTokenInPayload = z.object({
  token: z.string(),
});

export const deleteApiTokenPayload = z.object({
  token: z.string(),
});

export const getPermissionsResponse = z.object({
  permissions: z.array(z.string()),
});
