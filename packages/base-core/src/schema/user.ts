import { apiRouteId } from '@game-cms/core/schema';
import z from 'zod';

const displayName = z.string().min(1);
const permissions = z.array(apiRouteId);

export const createUserPayload = z.object({
  displayName,
  email: z.email(),
  password: z.string(),
  permissions,
});

export const updateUserPayload = z.object({
  displayName: displayName.optional(),
  permissions: permissions.optional(),
  password: z.string().optional(),
});
