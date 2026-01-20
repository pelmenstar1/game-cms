import type z from 'zod';

import type { PermissionId } from './auth.js';
import type { createUserPayload, updateUserPayload } from './schema/user.js';

export type User = {
  displayName: string;
  email: string;
  passwordHash: string;
  permissions: PermissionId[];
  isAdmin?: true;
};

export type NoPasswordUser<Id = string> = Omit<
  User & { id: Id },
  'passwordHash'
>;

export type CreateUserPayload = z.infer<typeof createUserPayload>;
export type UpdateUserPayload = z.infer<typeof updateUserPayload>;
