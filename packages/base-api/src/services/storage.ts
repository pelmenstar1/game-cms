import {
  type CreateFolderPayload,
  type DeleteStorageItemOptions,
  type ListStorageItemsOptions,
  type StorageItem,
  StorageItemType,
  type StorageItemWithMeta,
  type UploadFilePayload,
} from '@game-cms/base-types';
import { env } from '@game-cms/env';
import { service } from '@game-cms/utils';
import type { ClientSession, ObjectId, WithId } from 'mongodb';

import { getPage } from '../utils/paging.js';

function collection() {
  return cms.service('base::database').collection('base::storage');
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
      folderId: item.folderId,
    };
  }

  const { _id, mime, name, url, folderId } = item;
  const { size } = await storageProvider().protocol.getMeta(item);

  return {
    type: StorageItemType.FILE,
    id: _id,
    mime,
    name,
    url,
    size,
    folderId,
  };
}

export default service({
  id: 'base::storage',
  uploadFile: async (payload: UploadFilePayload) => {
    const { mime, name, folderId } = payload;
    const { url } = await storageProvider().protocol.upload(payload);

    const { insertedId } = await collection().insertOne({
      type: StorageItemType.FILE,
      url,
      mime,
      name,
      folderId,
    });

    return { id: insertedId, url };
  },
  createFolder: async (payload: CreateFolderPayload) => {
    const { name, folderId } = payload;

    const { insertedId } = await collection().insertOne({
      type: StorageItemType.FOLDER,
      name,
      folderId,
    });

    return insertedId;
  },
  list: async (options: ListStorageItemsOptions) => {
    const { items, meta } = await getPage(collection(), options, [
      { $match: { folderId: options.folderId } },
    ]);

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
