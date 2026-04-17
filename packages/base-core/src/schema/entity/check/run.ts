import { pagingOptionsSchema } from '@game-cms/core/schema';
import { stringObjectId } from '@game-cms/shared/mongo';
import { zodMaybeArray } from '@game-cms/shared/zod';
import z from 'zod';

export const listEntityCheckRunsOptions = z.object({
  ...pagingOptionsSchema.shape,
  checkId: z.string().optional(),
  runId: zodMaybeArray(stringObjectId).optional(),
  entityId: z.string().optional(),
  documentId: stringObjectId.optional(),
});
