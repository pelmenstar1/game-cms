import { stringObjectId } from '@game-cms/shared/mongo';
import z from 'zod';

export const updateReviewersPayload = z.object({
  userIds: z.array(stringObjectId),
});
