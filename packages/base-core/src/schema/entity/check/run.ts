import { pagingOptionsSchema } from '@game-cms/core/schema';
import z from 'zod';

export const listEntityCheckRunsOptions = z.object({
  ...pagingOptionsSchema.shape,
  checkId: z.string(),
  entityId: z.string(),
  documentId: z.string(),
});
