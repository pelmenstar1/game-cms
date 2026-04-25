import { pagingOptionsSchema } from '@game-cms/core/schema';
import { objectId, stringObjectId } from '@game-cms/shared/mongo';
import { stringBoolean } from '@game-cms/shared/zod';
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
  hidden: stringBoolean.optional(),
  originFile: stringObjectId.optional(),
});

export const listStorageItemsOptions = z.object({
  ...pagingOptionsSchema.shape,
  includeHidden: stringBoolean.optional(),
  parent: z.union([stringObjectId, z.literal('no-parent')]).optional(),
  search: z.string().optional(),
});

export const deleteStorageItemOptions = z.object({
  force: stringBoolean.optional(),
});

export const traceFileOptions = z.object({
  ...pagingOptionsSchema.shape,
  concise: stringBoolean.optional(),
});
