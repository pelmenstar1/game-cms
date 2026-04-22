import type {
  AbortOptions,
  CreateFolderPayload,
  DeleteStorageItemOptions,
  ListStorageItemsOptions,
  StorageFilePersistentItem,
  StorageFolderItem,
  StoragePersistentItem,
  StorageProvider,
  UploadFilePayload,
} from '@game-cms/base-core';
import { StorageItemType } from '@game-cms/base-core';
import { service } from '@game-cms/core';
import { cms, env } from '@game-cms/global';
import { FileSource } from '@game-cms/shared/node';
import type { ObjectId } from 'mongodb';

import {
  baseDeleteById,
  baseGetContent,
  baseGetInfo,
  baseGetInfoMap,
  baseGetNameMap,
  baseGetUrl,
  baseListItems,
  basePatchContent,
  baseUploadFile,
  collection,
} from './internal.js';

declare module '@game-cms/base-core' {
  interface AppEventsRegistry {
    'base::storage::fileUploaded': StorageFilePersistentItem & { id: ObjectId };
    'base::storage::folderCreated': CreateFolderPayload & { id: ObjectId };
    'base::storage::itemDeleted': { id: ObjectId };
  }

  interface DatabaseCollectionTypeMap {
    'base::storage': StoragePersistentItem;
  }
}

function storageProvider<Extra>(): StorageProvider<Extra> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return env().config.storage.provider;
}

async function getContent(
  id: ObjectId,
  options?: AbortOptions
): Promise<Uint8Array>;

async function getContent(
  id: ObjectId,
  options: AbortOptions & { encoding: BufferEncoding }
): Promise<string>;

async function getContent(
  id: ObjectId,
  options?: AbortOptions & { encoding?: BufferEncoding }
): Promise<Uint8Array | string> {
  return baseGetContent(storageProvider(), id, options);
}

export default service({
  id: 'base::storage',
  lifecycle: {
    onInit: async () => {
      await storageProvider().init?.();
      await collection().createIndex({ name: 'text' });
    },
  },
  collection,
  uploadFile: (payload: UploadFilePayload) => {
    return baseUploadFile(storageProvider(), payload);
  },
  patchContent: (id: ObjectId, content: FileSource, options?: AbortOptions) => {
    return basePatchContent(storageProvider(), id, content, options);
  },
  createFolder: async (payload: CreateFolderPayload) => {
    const { name, parent } = payload;

    const item: StorageFolderItem = {
      name,
      parent,
    };

    const { insertedId } = await collection().insertOne({
      type: StorageItemType.FOLDER,
      ...item,
    });

    cms()
      .service('base::appEvents')
      .emit('base::storage::folderCreated', { ...item, id: insertedId });

    return insertedId;
  },
  getInfo: <Extra>(id: ObjectId, options?: AbortOptions) => {
    return baseGetInfo<Extra>(storageProvider(), id, options);
  },
  getInfoMap: <Extra>(ids: ObjectId[], options?: AbortOptions) => {
    return baseGetInfoMap<Extra>(storageProvider(), ids, options);
  },
  getNameMap: baseGetNameMap,
  getContent,
  getUrl: (id: ObjectId, options?: AbortOptions) => {
    return baseGetUrl(storageProvider(), id, options);
  },
  list: <Extra>(options: ListStorageItemsOptions & AbortOptions) => {
    return baseListItems<Extra>(storageProvider(), options);
  },
  deleteById: (id: ObjectId, options?: DeleteStorageItemOptions) => {
    return baseDeleteById(storageProvider(), id, options);
  },
});
