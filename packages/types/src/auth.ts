import z from 'zod';

export const signInPayload = z.object({
  email: z.string(),
  password: z.string(),
});

export type SignInPayload = z.infer<typeof signInPayload>;

export const jwtPayloadSchema = z.object({
  id: z.string(),
  name: z.string(),
  prms: z.array(z.string()), // permissions
});

export type JwtPayload = z.infer<typeof jwtPayloadSchema>;

export type ApiToken = {
  token: string;
  name: string;
  expirationDate: Date;
  permissions: string[];
};

export const createApiTokenPayload = z.object({
  name: z.string(),
  expirationTime: z.number(),
  permissions: z.array(z.string()),
});

export type CreateApiTokenPayload = z.infer<typeof createApiTokenPayload>;

export const createApiTokenResponse = z.object({
  token: z.string(),
});

export type CreateApiTokenResponse = z.infer<typeof createApiTokenPayload>;

export const signTokenInPayload = z.object({
  token: z.string(),
});

export type SignTokenInPayload = z.infer<typeof signTokenInPayload>;

export const deleteApiTokenPayload = z.object({
  token: z.string(),
});

export type DeleteApiTokenPayload = z.infer<typeof deleteApiTokenPayload>;
