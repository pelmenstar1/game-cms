import { pagingOptionsSchema } from '@game-cms/core/schema';
import { objectId, stringObjectId } from '@game-cms/shared/mongo';
import z from 'zod';

import { StorageItemType } from '../storage.js';

const name = z
  .string()
  .min(1)
  .refine((value) => !value.includes('/'), {
    error: 'Item name cannot have slashes',
  });

export const storageFileItem = z.object({
  name,
  mime: z.string(),
  url: z.string(),
  parent: objectId.optional(),
  hidden: z.boolean().optional(),
});

export const storageFolderItem = z.object({
  name,
  parent: objectId.optional(),
});

export const storageItem = z.discriminatedUnion('type', [
  z.object({
    type: z.literal(StorageItemType.FILE),
    ...storageFileItem.shape,
  }),
  z.object({
    type: z.literal(StorageItemType.FOLDER),
    ...storageFolderItem.shape,
  }),
]);

export const storageItemWithMeta = z.discriminatedUnion('type', [
  z.object({
    id: objectId,
    type: z.literal(StorageItemType.FILE),
    size: z.number(),
    ...storageFileItem.shape,
  }),
  z.object({
    id: objectId,
    type: z.literal(StorageItemType.FOLDER),
    ...storageFolderItem.shape,
  }),
]);

export const createFolderPayload = z.object({
  name: z.string(),
  parent: objectId.optional(),
});

export const createFolderResponse = z.object({
  id: objectId,
});

export const uploadFileMeta = z.object({
  parent: stringObjectId.optional(),
  hidden: z.boolean().optional(),
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

export const listStorageItemsResponse = z.object({
  items: z.array(storageItemWithMeta),
  meta: z.object({
    totalCount: z.number(),
  }),
});

export const deleteStorageItemOptions = z.object({
  force: z.boolean().optional(),
});
