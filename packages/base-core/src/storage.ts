import type {
  ConditionalPartial,
  MaybePromise,
  PageData,
  UndefinedIf,
} from '@game-cms/shared';
import type { ObjectId } from 'mongodb';
import type z from 'zod';

import type {
  createFolderPayload,
  createFolderResponse,
  deleteStorageItemOptions,
  listStorageItemsOptions,
  uploadFileMeta,
  uploadFileResponse,
} from './schema/storage.js';
import type { StorageProvider, UploadFilePayload } from './storageProvider.js';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars
export interface StorageAddonTypeMap<Extra> {}

export type StorageAddonId = keyof StorageAddonTypeMap<unknown>;

type StorageAddonPersistentData<
  T extends StorageAddonId,
  Extra,
> = StorageAddonTypeMap<Extra>[T]['persistent'];

type StorageAddonHydratedData<
  T extends StorageAddonId,
  Extra,
> = StorageAddonTypeMap<Extra>[T]['hydrated'];

type IsAddonDataOptional<
  T extends StorageAddonId,
  Extra,
> = StorageAddonTypeMap<Extra>[T]['optional'] extends true ? true : false;

export type StorageAddonContext<Extra = unknown> = {
  provider: StorageProvider<Extra>;
};

export type StorageAddon<Id extends StorageAddonId = StorageAddonId> = {
  id: Id;

  getData: <Extra>(
    item: UploadFilePayload<Uint8Array>,
    context: StorageAddonContext<Extra>
  ) => MaybePromise<
    | StorageAddonPersistentData<Id, Extra>
    | UndefinedIf<IsAddonDataOptional<Id, Extra>>
  >;

  hydrateData: <Extra>(
    data: StorageAddonPersistentData<Id, Extra>,
    context: StorageAddonContext<Extra>
  ) => MaybePromise<StorageAddonHydratedData<Id, Extra>>;
};

export type AnyStorageAddon = {
  [Id in StorageAddonId]: StorageAddon<Id>;
}[StorageAddonId];

type BaseAddonDataMap<K extends string, Extra> = ConditionalPartial<{
  [K2 in keyof StorageAddonTypeMap<Extra>]: {
    optional: StorageAddonTypeMap<Extra>[K2]['optional'];
    value: StorageAddonTypeMap<Extra>[K2][K];
  };
}>;

export type StorageAddonPersistentDataMap<Extra = unknown> = BaseAddonDataMap<
  'persistent',
  Extra
>;

export type StorageAddonHydratedDataMap<Extra = unknown> = BaseAddonDataMap<
  'hydrated',
  Extra
>;

export enum StorageItemType {
  FILE = 0,
  FOLDER = 1,
}

type BaseStorageFileItem<Addons> = {
  name: string;
  mime: string;
  parent?: ObjectId;
  hidden?: boolean;
  size: number;
  addons: Addons;
};

export type StorageFilePersistentItem<Extra = unknown> = BaseStorageFileItem<
  StorageAddonPersistentDataMap<Extra>
> & { extra: Extra };

export type StorageFileItem =
  BaseStorageFileItem<StorageAddonHydratedDataMap> & { url: string };

export type StorageFileItemWithType = StorageFileItem & {
  type: StorageItemType.FILE;
};

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

export type StorageItem =
  | StorageFileItemWithType
  | ({ type: StorageItemType.FOLDER } & StorageFolderItem);

export type StorageItemWithId = StorageItem & { id: ObjectId };

export type UploadFileMeta = z.infer<typeof uploadFileMeta>;

export type UploadFileResponse = z.infer<typeof uploadFileResponse>;
export type CreateFolderPayload = z.infer<typeof createFolderPayload>;
export type CreateFolderResponse = z.infer<typeof createFolderResponse>;

export type ListStorageItemsOptions = z.infer<typeof listStorageItemsOptions>;
export type ListStorageItemsResponse = PageData<StorageItemWithId>;

export type DeleteStorageItemOptions = z.infer<typeof deleteStorageItemOptions>;

export function storageAddon<Id extends StorageAddonId>(
  value: StorageAddon<Id>
) {
  return value;
}
