import z from 'zod';

import { permissionId } from './auth.js';

const displayName = z.string().min(1);

export const createUserPayload = z.object({
  displayName,
  email: z.email(),
  password: z.string(),
  permissions: z.array(permissionId),
});

export const updateUserPayload = z.object({
  name: displayName.optional(),
  permissions: z.array(permissionId).optional(),
  password: z.string().optional(),
});
