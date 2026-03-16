import { ToClientType } from '@game-cms/core';
import type { PageData } from '@game-cms/shared';
import type { ObjectId } from 'mongodb';
import type z from 'zod';

import { EntityId, EntityInternalOutDataById } from '../entity/core.js';
import type {
  createFolderPayload,
  createFolderResponse,
  deleteStorageItemOptions,
  listStorageItemsOptions,
  traceFileOptions,
  uploadFileMeta,
  uploadFileResponse,
} from '../schema/storage.js';
import {
  StorageAddonHydratedDataMap,
  StorageAddonPersistentDataMap,
} from './addon.js';

export enum StorageItemType {
  FILE = 0,
  FOLDER = 1,
}

interface BaseStorageFileItem<Addons> {
  name: string;
  mime: string;
  parent?: ObjectId;
  hidden?: boolean;
  size: number;
  addons: Addons;

  // The ID of the actual file this file is shadowing
  originFile?: ObjectId;
}

export interface StorageFilePersistentItem<
  Extra = unknown,
> extends BaseStorageFileItem<StorageAddonPersistentDataMap<Extra>> {
  extra: Extra;
}

export interface StorageFileItem<Extra = unknown> extends BaseStorageFileItem<
  StorageAddonHydratedDataMap<Extra>
> {
  url: string;
}

export interface StorageFileItemWithType<
  Extra = unknown,
> extends StorageFileItem<Extra> {
  type: StorageItemType.FILE;
}

export type StorageFileClientItemWithType<Extra = unknown> = ToClientType<
  StorageFileItemWithType<Extra>
>;

export interface StorageFileItemWithId extends StorageFileItem {
  id: ObjectId;
}

export type StorageFolderItem = {
  name: string;
  parent?: ObjectId;
};

export type StoragePersistentItem<Extra = unknown> =
  | ({ type: StorageItemType.FILE } & StorageFilePersistentItem<Extra>)
  | ({ type: StorageItemType.FOLDER } & StorageFolderItem);

export type StorageItem<Extra = unknown> =
  | StorageFileItemWithType<Extra>
  | ({ type: StorageItemType.FOLDER } & StorageFolderItem);

export type StorageClientItem<Extra = unknown> = ToClientType<
  StorageItem<Extra>
>;

export type StorageItemWithId<Extra = unknown> = StorageItem<Extra> & {
  id: ObjectId;
};

export type UploadFileMeta = z.infer<typeof uploadFileMeta>;

export type UploadFileResponse = z.infer<typeof uploadFileResponse>;
export type CreateFolderPayload = z.infer<typeof createFolderPayload>;
export type CreateFolderResponse = z.infer<typeof createFolderResponse>;

export type ListStorageItemsOptions = z.infer<typeof listStorageItemsOptions>;
export type ListStorageItemsResponse = PageData<StorageItemWithId>;

export type DeleteStorageItemOptions = z.infer<typeof deleteStorageItemOptions>;

export type TraceFileConciseEntry<Id extends EntityId = EntityId> = {
  entityId: Id;
  document: { id: ObjectId };
};

export type TraceFileEntry<Id extends EntityId = EntityId> = {
  entityId: Id;
  document: EntityInternalOutDataById<Id>;
};

export type TraceFileOptions = z.infer<typeof traceFileOptions>;

export type TraceFileConciseResponse = PageData<TraceFileConciseEntry>;
export type TraceFileResponse = PageData<TraceFileEntry>;
