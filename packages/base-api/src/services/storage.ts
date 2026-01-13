import {
  type CreateFolderPayload,
  type DeleteStorageItemOptions,
  type ListStorageItemsOptions,
  type StorageFileItem,
  type StorageFileItemWithId,
  type StorageFolderItem,
  type StorageItem,
  StorageItemType,
  type StorageItemWithMeta,
  type UploadFilePayload,
} from '@game-cms/base-core';
import { service } from '@game-cms/core';
import { cms, env } from '@game-cms/global';
import type { ClientSession, Document, ObjectId, WithId } from 'mongodb';

import { getPage } from '../utils/paging.js';

declare module '@game-cms/base-core' {
  interface AppEventsRegistry {
    'base::storage::fileUploaded': StorageFileItemWithId<ObjectId>;
    'base::storage::folderCreated': CreateFolderPayload & { id: ObjectId };
    'base::storage::itemDeleted': { id: ObjectId };
  }
}

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

  const { _id, mime, name, url, parent, hidden } = item;
  const { size } = await storageProvider().protocol.getMeta(item.url);

  return {
    type: StorageItemType.FILE,
    id: _id,
    mime,
    name,
    url,
    size,
    parent,
    hidden: hidden ?? false,
  };
}

export default service({
  id: 'base::storage',
  collection,
  uploadFile: async (payload: UploadFilePayload) => {
    const { mime, name, parent, hidden } = payload;
    const { url } = await storageProvider().protocol.upload(payload);

    const item: StorageFileItem = {
      url,
      mime,
      name,
      parent,
      hidden,
    };

    const { insertedId } = await collection().insertOne({
      ...item,
      type: StorageItemType.FILE,
    });

    cms()
      .service('base::appEvents')
      .emit('base::storage::fileUploaded', { ...item, id: insertedId });

    return { id: insertedId, url };
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
    let matchOperator: Document | undefined;

    if (parent) {
      (matchOperator ??= {}).parent = parent;
    }

    if (!options.includeHidden) {
      (matchOperator ??= {}).hidden = {
        $ne: true,
      };
    }

    const { items, meta } = await getPage(collection(), options, {
      pre: matchOperator && [{ $match: matchOperator }],
    });

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

      cms()
        .service('base::appEvents')
        .emit('base::storage::itemDeleted', { id });
    }
  },
});
