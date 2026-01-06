import {
  type CreateFolderPayload,
  type DeleteStorageItemOptions,
  type ListStorageItemsOptions,
  type StorageItem,
  StorageItemType,
  type StorageItemWithMeta,
  type UploadFilePayload,
} from '@game-cms/base-types';
import { service } from '@game-cms/core';
import { cms, env } from '@game-cms/global';
import type { ClientSession, ObjectId, WithId } from 'mongodb';

import { getPage } from '../utils/paging.js';

function collection() {
  return cms().service('base::database').collection('base::storage');
}

function storageProvider() {
  return env().config.storage.provider;
}

async function moveItemsToRoot(folderId: ObjectId, session?: ClientSession) {
  await collection().updateMany(
    { folderId },
    { $unset: { folderId: 1 } },
    { session }
  );
}

async function hydrateItem(
  item: WithId<StorageItem>
): Promise<StorageItemWithMeta> {
  if (item.type === StorageItemType.FOLDER) {
    return {
      id: item._id,
      type: StorageItemType.FOLDER,
      name: item.name,
      parent: item.parent,
    };
  }

  const { _id, mime, name, url, parent } = item;
  const { size } = await storageProvider().protocol.getMeta(item.url);

  return {
    type: StorageItemType.FILE,
    id: _id,
    mime,
    name,
    url,
    size,
    parent,
  };
}

export default service({
  id: 'base::storage',
  collection,
  uploadFile: async (payload: UploadFilePayload) => {
    const { mime, name, parent } = payload;
    const { url } = await storageProvider().protocol.upload(payload);

    const { insertedId } = await collection().insertOne({
      type: StorageItemType.FILE,
      url,
      mime,
      name,
      parent,
    });

    return { id: insertedId, url };
  },
  createFolder: async (payload: CreateFolderPayload) => {
    const { name, parent } = payload;

    const { insertedId } = await collection().insertOne({
      type: StorageItemType.FOLDER,
      name,
      parent,
    });

    return insertedId;
  },
  getInfo: async (id: ObjectId): Promise<StorageItemWithMeta | null> => {
    const result = await collection().findOne({ _id: id });

    return result && hydrateItem(result);
  },
  getContent: async (id: ObjectId): Promise<Uint8Array> => {
    const result = await collection().findOne({ _id: id });

    const { protocol } = storageProvider();

    if (result?.type !== StorageItemType.FILE) {
      throw new Error('Expected all items to be files');
    }

    return protocol.getContent(result.url);
  },
  list: async (options: ListStorageItemsOptions) => {
    const { parent } = options;
    const { items, meta } = await getPage(
      collection(),
      options,
      parent ? [{ $match: { parent } }] : []
    );

    return {
      items: await Promise.all(items.map((item) => hydrateItem(item))),
      meta,
    };
  },
  deleteById: async (id: ObjectId, options?: DeleteStorageItemOptions) => {
    const item = await collection().findOne(
      { _id: id },
      { projection: { url: 1 } }
    );

    if (item) {
      if (item.type === StorageItemType.FILE) {
        try {
          await storageProvider().protocol.delete(item.url);
        } catch (error) {
          if (!options?.force) {
            throw error;
          }
        }
      } else {
        await moveItemsToRoot(id);
      }

      await collection().deleteOne({ _id: id });
    }
  },
});
