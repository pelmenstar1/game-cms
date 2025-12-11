import { objectId, stringObjectId } from '@game-cms/shared/mongo';
import { pagingOptionsSchema, type ToClientType } from '@game-cms/types';
import z from 'zod';

export enum StorageItemType {
  FILE = 0,
  FOLDER = 1,
}

const name = z
  .string()
  .min(1)
  .refine((value) => value.includes('/'), {
    error: 'Item name cannot have slashes',
  });

export const storageFileItem = z.object({
  name,
  mime: z.string(),
  url: z.string(),
  folderId: objectId.optional(),
});

export const storageFolderItem = z.object({
  name,
  folderId: objectId.optional(),
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

export type StorageFileItem = z.infer<typeof storageFileItem>;
export type ClientStorageFileItem = ToClientType<StorageFileItem>;
export type StorageFolderItem = z.infer<typeof storageFileItem>;
export type StorageItem = z.infer<typeof storageItem>;
export type StorageItemWithMeta = z.infer<typeof storageItemWithMeta>;
export type ClientStorageItemWithMeta = ToClientType<StorageItemWithMeta>;

export const uploadFileMeta = z.object({
  folderId: stringObjectId.optional(),
});

export type UploadFileMeta = z.infer<typeof uploadFileMeta>;

export const uploadFileResponse = z.object({
  id: objectId,
  url: z.string(),
});

export type UploadFileResponse = z.infer<typeof uploadFileResponse>;
export type ClientUploadFileResponse = ToClientType<UploadFileResponse>;

export type ClientFileUploadMeta = ToClientType<UploadFileMeta>;

export const createFolderPayload = z.object({
  name: z.string(),
  folderId: objectId.optional(),
});

export type CreateFolderPayload = z.infer<typeof createFolderPayload>;

export const createFolderResponse = z.object({
  id: objectId,
});

export type CreateFolderResponse = z.infer<typeof createFolderResponse>;

export const listStorageItemsOptions = z.object({
  ...pagingOptionsSchema.shape,
  folderId: objectId.optional(),
});

export type ListStorageItemsOptions = z.infer<typeof listStorageItemsOptions>;

export const listStorageItemsResponse = z.object({
  items: z.array(storageItemWithMeta),
  meta: z.object({
    totalCount: z.number(),
  }),
});

export type ListStorageItemsResponse = z.infer<typeof listStorageItemsResponse>;
export type ClientListStorageFilesResponse =
  ToClientType<ListStorageItemsResponse>;

export const deleteStorageItemOptions = z.object({
  force: z.boolean().optional(),
});

export type DeleteStorageItemOptions = z.infer<typeof deleteStorageItemOptions>;
