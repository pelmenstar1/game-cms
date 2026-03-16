import path from 'node:path';
import { Readable } from 'node:stream';
import { buffer } from 'node:stream/consumers';

import type {
  AbortOptions,
  FileSource,
  StorageAddon,
  StorageAddonContext,
  StorageProviderUploadResult,
} from '@game-cms/base-core';
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
import type {
  ClientSession,
  Collection,
  Document,
  ObjectId,
  WithId,
} from 'mongodb';

import { getPage } from '../utils/paging.js';

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

function collection<Extra>() {
  return cms()
    .service('base::database')
    .collection('base::storage') as Collection<StoragePersistentItem<Extra>>;
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

async function hydrateAddonData<Extra>(
  persistent: StorageAddonPersistentDataMap<Extra>
): Promise<StorageAddonHydratedDataMap<Extra>> {
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

async function hydrateItem<Extra>(
  item: WithId<StoragePersistentItem<Extra>>
): Promise<StorageItemWithId<Extra>> {
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
  const url = await protocol.getUrl(extra);

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

function ensureFileItem<Extra>(
  item: StoragePersistentItem<Extra> | null
): asserts item is StoragePersistentItem<Extra> & {
  type: StorageItemType.FILE;
} {
  if (item?.type !== StorageItemType.FILE) {
    throw new Error('Expected file item');
  }
}

async function getFileExtraById(id: ObjectId, options?: AbortOptions) {
  const item = await collection().findOne(
    { _id: id },
    { projection: { type: 1, extra: 1 }, signal: options?.signal }
  );

  ensureFileItem(item);

  return item.extra;
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
  const extra = await getFileExtraById(id, options);

  const { protocol } = storageProvider();

  const content = await protocol.getContent(extra, options);
  if (options?.encoding) {
    return Buffer.from(content).toString(options.encoding);
  }

  return content;
}

function getStorageFileTypeAddons() {
  return filterOutNullable(
    env().config.plugins.flatMap((plugin) => plugin.config?.storageFileTypes)
  );
}

function matchStorageFileTypeAddon(extension: string) {
  const addons = getStorageFileTypeAddons();

  return addons.find(({ test }) => {
    if (typeof test === 'string') {
      return test === extension;
    }

    return test(extension);
  });
}

function enhanceMime(name: string, mime: string) {
  if (mime === 'application/octet-stream') {
    const extension = path.extname(name).slice(1);

    if (extension) {
      const addon = matchStorageFileTypeAddon(extension);

      if (addon) {
        return addon.resultMime;
      }
    }
  }

  return mime;
}

export default service({
  id: 'base::storage',
  init: async () => {
    await storageProvider().init?.();
  },
  collection,
  uploadFile: async (payload: UploadFilePayload) => {
    const { protocol } = storageProvider();

    const { mime, name, parent, hidden, content, originFile } = payload;
    const addons = getAddons();

    const enhancedPayload: UploadFilePayload = {
      ...payload,
      mime: enhanceMime(name, mime),
    };

    let addonData: StorageAddonPersistentDataMap = {};
    let uploadResult: StorageProviderUploadResult<unknown>;

    if (addons.length > 0) {
      const staticPayload = {
        ...enhancedPayload,
        content: content instanceof Readable ? await buffer(content) : content,
      };

      uploadResult = await protocol.upload(staticPayload);

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

      addonData = Object.fromEntries(filterOutNullable(addonEntries));
    } else {
      uploadResult = await protocol.upload(enhancedPayload);
    }

    const item: StorageFilePersistentItem = {
      mime: enhancedPayload.mime,
      name,
      parent,
      hidden,
      originFile,
      size: uploadResult.size,
      extra: uploadResult.extra,
      addons: addonData,
    };

    const { insertedId } = await collection().insertOne({
      ...item,
      type: StorageItemType.FILE,
    });

    const url = await protocol.getUrl(item.extra);

    cms()
      .service('base::appEvents')
      .emit('base::storage::fileUploaded', {
        ...item,
        id: insertedId,
      });

    return { id: insertedId, url };
  },
  patchContent: async (
    id: ObjectId,
    content: FileSource,
    options?: AbortOptions
  ) => {
    const item = await collection().findOne(
      { _id: id },
      { signal: options?.signal }
    );

    ensureFileItem(item);

    const size = await storageProvider().protocol.patchContent(
      { content, extra: item.extra, mime: item.mime },
      options
    );

    await collection().updateOne({ _id: id }, { $set: { size } });
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
  getInfo: async (
    id: ObjectId,
    options?: AbortOptions
  ): Promise<StorageItemWithId | null> => {
    const result = await collection().findOne(
      { _id: id },
      { signal: options?.signal }
    );

    return result && hydrateItem(result);
  },
  getContent,
  getUrl: async (id: ObjectId, options?: AbortOptions) => {
    const extra = await getFileExtraById(id, options);

    return await storageProvider().protocol.getUrl(extra);
  },
  list: async (options: ListStorageItemsOptions & AbortOptions) => {
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
    async function deleteViaProvider(extra: unknown) {
      try {
        await storageProvider().protocol.delete(extra);
      } catch (error) {
        if (!options?.force) {
          throw error;
        }
      }
    }

    const items = await collection()
      .find(
        { $or: [{ _id: id }, { originFile: id }] },
        { projection: { type: 1, extra: 1 } }
      )
      .toArray();

    const folderItem = items.find(
      (item) => item.type === StorageItemType.FOLDER
    );

    if (folderItem) {
      await moveItemsToRoot(id);

      await collection().deleteOne({ _id: id });
    } else {
      await Promise.all(
        items
          .filter((item) => item.type === StorageItemType.FILE)
          .map((item) => deleteViaProvider(item.extra))
      );

      await collection().deleteMany({
        _id: { $in: items.map(({ _id }) => _id) },
      });
    }

    cms().service('base::appEvents').emit('base::storage::itemDeleted', { id });
  },
});
