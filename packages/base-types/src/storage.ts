import type { ToClientType } from '@game-cms/types';
import type z from 'zod';

import type {
  createFolderPayload,
  createFolderResponse,
  deleteStorageItemOptions,
  listStorageItemsOptions,
  listStorageItemsResponse,
  storageFileItem,
  storageItem,
  storageItemWithMeta,
  uploadFileMeta,
  uploadFileResponse,
} from './schema/storage.js';

export enum StorageItemType {
  FILE = 0,
  FOLDER = 1,
}

export type StorageFileItem = z.infer<typeof storageFileItem>;
export type ClientStorageFileItem = ToClientType<StorageFileItem>;
export type StorageFolderItem = z.infer<typeof storageFileItem>;
export type StorageItem = z.infer<typeof storageItem>;
export type StorageItemWithMeta = z.infer<typeof storageItemWithMeta>;
export type ClientStorageItemWithMeta = ToClientType<StorageItemWithMeta>;

export type UploadFileMeta = z.infer<typeof uploadFileMeta>;

export type UploadFileResponse = z.infer<typeof uploadFileResponse>;
export type ClientUploadFileResponse = ToClientType<UploadFileResponse>;
export type ClientFileUploadMeta = ToClientType<UploadFileMeta>;

export type CreateFolderPayload = z.infer<typeof createFolderPayload>;
export type CreateFolderResponse = z.infer<typeof createFolderResponse>;

export type ListStorageItemsOptions = z.infer<typeof listStorageItemsOptions>;
export type ListStorageItemsResponse = z.infer<typeof listStorageItemsResponse>;
export type ClientListStorageFilesResponse =
  ToClientType<ListStorageItemsResponse>;

export type DeleteStorageItemOptions = z.infer<typeof deleteStorageItemOptions>;
