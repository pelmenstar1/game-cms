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

export const createFolderResponse = z.object({
  id: objectId,
});

export const uploadFileMeta = z.strictObject({
  parent: stringObjectId.optional(),
  hidden: z.boolean().optional(),
  originFile: stringObjectId.optional(),
});

export const uploadFileResponse = z.object({
  id: objectId,
  url: z.string(),
});

export const listStorageItemsOptions = z.object({
  ...pagingOptionsSchema.shape,
  includeHidden: z.boolean().optional(),
  parent: stringObjectId.optional(),
});

export const deleteStorageItemOptions = z.object({
  force: z.boolean().optional(),
});

export const traceFileOptions = z.object({
  ...pagingOptionsSchema.shape,
  concise: z.boolean().optional(),
});
