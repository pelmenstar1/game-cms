import type z from 'zod';

import type { PermissionId } from './auth.js';
import type { createUserPayload } from './schema/user.js';

export type CreateUserPayload = z.infer<typeof createUserPayload>;

export type ServerUser = {
  name: string;
  email: string;
  passwordHash: string;
  permissions: PermissionId[];
};
