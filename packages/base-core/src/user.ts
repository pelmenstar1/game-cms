import type { ApiRouteId } from '@game-cms/core/api';
import { ObjectId } from 'mongodb';
import type z from 'zod';

import type { createUserPayload, updateUserPayload } from './schema/user.js';

export type User = {
  displayName: string;
  email: string;
  passwordHash: string;
  permissions: ApiRouteId[];
  isAdmin?: true;
};

export type NoPasswordUser<Id = string> = Omit<
  User & { id: Id },
  'passwordHash'
>;

export type CreateUserPayload = z.infer<typeof createUserPayload>;
export type CreateUserResponse = {
  id: ObjectId;
};

export type UpdateUserPayload = z.infer<typeof updateUserPayload>;
