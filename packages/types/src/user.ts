import z from 'zod';

export const createUserPayload = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string(),
  permissions: z.array(z.string()),
});

export type CreateUserPayload = z.infer<typeof createUserPayload>;

export type ServerUser = {
  name: string;
  email: string;
  passwordHash: string;
  permissions: string[];
};
