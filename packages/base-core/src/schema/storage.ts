import { pagingOptionsSchema } from '@game-cms/core/schema';
import { objectId, stringObjectId } from '@game-cms/shared/mongo';
import z from 'zod';

const name = z
  .string()
  .min(1)
  .refine((value) => !value.includes('/'), {
    error: 'Item name cannot have slashes',
  });

export const createFolderPayload = z.object({
  name,
  parent: objectId.optional(),
});

export const uploadFileMeta = z.strictObject({
  parent: stringObjectId.optional(),
  hidden: z.boolean().optional(),
  originFile: stringObjectId.optional(),
});

export const listStorageItemsOptions = z.object({
  ...pagingOptionsSchema.shape,
  includeHidden: z.boolean().optional(),
  parent: z.union([stringObjectId, z.literal('no-parent')]).optional(),
  search: z.string().optional(),
});

export const deleteStorageItemOptions = z.object({
  force: z.boolean().optional(),
});

export const traceFileOptions = z.object({
  ...pagingOptionsSchema.shape,
  concise: z.boolean().optional(),
});
