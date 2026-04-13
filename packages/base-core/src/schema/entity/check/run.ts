import { pagingOptionsSchema } from '@game-cms/core/schema';
import z from 'zod';

export const listEntityCheckRunsOptions = z.object({
  ...pagingOptionsSchema.shape,
  checkId: z.string().optional(),
  entityId: z.string().optional(),
  documentId: z.string().optional(),
});
