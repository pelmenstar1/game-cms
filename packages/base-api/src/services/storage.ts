import { Readable } from 'node:stream';
import { buffer } from 'node:stream/consumers';

import type { StorageAddon, StorageAddonContext } from '@game-cms/base-core';
import {
  type CreateFolderPayload,
  type DeleteStorageItemOptions,
  type ListStorageItemsOptions,
  type StorageAddonHydratedDataMap,
  type StorageAddonPersistentDataMap,
  type StorageFilePersistentItem,
  type StorageFolderItem,
  StorageItemType,
  type StorageItemWithId,
  type StoragePersistentItem,
  type UploadFilePayload,
} from '@game-cms/base-core';
import { service } from '@game-cms/core';
import { cms, env } from '@game-cms/global';
import { filterOutNullable } from '@game-cms/shared/collections';
import { asyncMapObject } from '@game-cms/shared/object';
import type { ClientSession, Document, ObjectId, WithId } from 'mongodb';

import { getPage } from '../utils/paging.js';

declare module '@game-cms/base-core' {
  interface AppEventsRegistry {
    'base::storage::fileUploaded': StorageFilePersistentItem & { id: ObjectId };
    'base::storage::folderCreated': CreateFolderPayload & { id: ObjectId };
    'base::storage::itemDeleted': { id: ObjectId };
  }

  interface DatabaseEntityMap {
    'base::storage': StoragePersistentItem;
  }
}

function collection() {
  return cms().service('base::database').collection('base::storage');
}

function storageProvider() {
  return env().config.storage.provider;
}

function storageAddonContext(): StorageAddonContext {
  return { provider: storageProvider() };
}

function getAddons() {
  return (env().config.storage.addons ?? []) as StorageAddon[];
}

async function moveItemsToRoot(folderId: ObjectId, session?: ClientSession) {
  await collection().updateMany(
    { folderId },
    { $unset: { folderId: 1 } },
    { session }
  );
}

async function hydrateAddonData(
  persistent: StorageAddonPersistentDataMap
): Promise<StorageAddonHydratedDataMap> {
  const addons = getAddons();
  const context = storageAddonContext();

  return asyncMapObject(persistent, (data, key) => {
    const addon = addons.find(({ id }) => id === key);
    if (addon === undefined) {
      throw new Error(`Unknown addon: ${key}`);
    }

    return addon.hydrateData(data, context);
  });
}

async function hydrateItem(
  item: WithId<StoragePersistentItem>
): Promise<StorageItemWithId> {
  if (item.type === StorageItemType.FOLDER) {
    return {
      id: item._id,
      type: StorageItemType.FOLDER,
      name: item.name,
      parent: item.parent,
    };
  }

  const { protocol } = storageProvider();

  const { _id, mime, name, extra, parent, hidden, size, addons } = item;
  const url = protocol.getUrl(extra);

  const hydratedAddons = await hydrateAddonData(addons);

  return {
    type: StorageItemType.FILE,
    id: _id,
    mime,
    name,
    url,
    parent,
    size,
    addons: hydratedAddons,
    hidden: hidden ?? false,
  };
}

export default service({
  id: 'base::storage',
  init: async () => {
    await storageProvider().init?.();
  },
  collection,
  uploadFile: async (payload: UploadFilePayload) => {
    const { protocol } = storageProvider();

    const { mime, name, parent, hidden, content } = payload;
    const addons = getAddons();

    const item: StorageFilePersistentItem = {
      mime,
      name,
      parent,
      hidden,
      size: 0,
      extra: null,
      addons: {},
    };

    if (addons.length > 0) {
      const staticPayload = {
        ...payload,
        content: content instanceof Readable ? await buffer(content) : content,
      };

      const uploadResult = await protocol.upload(staticPayload);

      const context = storageAddonContext();
      const addonEntries = await Promise.all(
        addons.map(async (addon) => {
          // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
          const data = await addon.getData(staticPayload, context);

          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (data !== undefined) {
            return [addon.id, data] as const;
          }
        })
      );

      Object.assign(item, uploadResult);
      item.addons = Object.fromEntries(filterOutNullable(addonEntries));
    } else {
      const uploadResult = await protocol.upload(payload);

      Object.assign(item, uploadResult);
    }

    const { insertedId } = await collection().insertOne({
      ...item,
      type: StorageItemType.FILE,
    });

    const url = protocol.getUrl(item.extra);

    cms()
      .service('base::appEvents')
      .emit('base::storage::fileUploaded', {
        ...item,
        id: insertedId,
      });

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
  getInfo: async (id: ObjectId): Promise<StorageItemWithId | null> => {
    const result = await collection().findOne({ _id: id });

    return result && hydrateItem(result);
  },
  getContent: async (id: ObjectId): Promise<Uint8Array> => {
    const result = await collection().findOne(
      { _id: id },
      { projection: { type: 1, extra: 1 } }
    );

    const { protocol } = storageProvider();

    if (result?.type !== StorageItemType.FILE) {
      throw new Error('Expected the item to be file');
    }

    return protocol.getContent(result.extra);
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
      { projection: { type: 1, extra: 1 } }
    );

    if (item) {
      if (item.type === StorageItemType.FILE) {
        try {
          await storageProvider().protocol.delete(item.extra);
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
