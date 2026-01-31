import type { NoPasswordUser } from '@game-cms/base-core';
import type z from 'zod';

import type { updateReviewersPayload } from '../schema/review.js';

export type UpdateReviewersPayload = z.infer<typeof updateReviewersPayload>;

export type GetReviewersResponse = {
  users: NoPasswordUser[];
};
