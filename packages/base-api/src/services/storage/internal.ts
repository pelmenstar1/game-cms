import path from 'node:path';
import { Readable } from 'node:stream';
import { buffer } from 'node:stream/consumers';

import {
  AbortOptions,
  DeleteStorageItemOptions,
  ListStorageItemsOptions,
  StorageAddon,
  StorageAddonContext,
  StorageAddonHydratedDataMap,
  StorageAddonPersistentDataMap,
  StorageFilePersistentItem,
  StorageItemType,
  StorageItemWithId,
  StoragePersistentItem,
  StorageProvider,
  StorageProviderDeleteManyResult,
  StorageProviderUploadResult,
  UploadFilePayload,
} from '@game-cms/base-core';
import { ApiError } from '@game-cms/core/api';
import { cms, env } from '@game-cms/global';
import { filterOutNullable } from '@game-cms/shared/collections';
import { FileSource } from '@game-cms/shared/node';
import { asyncMapObject, fromEntriesNullable } from '@game-cms/shared/object';
import { ClientSession, Collection, Document, ObjectId, WithId } from 'mongodb';

import { getPage } from '../../utils/paging.js';

export function collection<Extra>() {
  return cms()
    .service('base::database')
    .collection('base::storage') as Collection<StoragePersistentItem<Extra>>;
}

export async function moveItemsToRoot(
  folderId: ObjectId,
  session?: ClientSession
) {
  await collection().updateMany(
    { folderId },
    { $unset: { folderId: 1 } },
    { session }
  );
}

export function getAddons() {
  return (env().config.storage.addons ?? []) as StorageAddon[];
}

export async function hydrateAddonData<Extra>(
  persistent: StorageAddonPersistentDataMap<Extra>,
  context: StorageAddonContext<Extra>
): Promise<StorageAddonHydratedDataMap<Extra>> {
  const addons = getAddons();

  return asyncMapObject(persistent, (data, key) => {
    const addon = addons.find(({ id }) => id === key);
    if (addon === undefined) {
      throw new Error(`Unknown addon: ${key}`);
    }

    return addon.hydrateData(data, context);
  });
}

export async function hydrateItem<Extra>(
  provider: StorageProvider<Extra>,
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

  const { protocol } = provider;

  const { _id, mime, name, extra, parent, hidden, size, addons } = item;
  const url = await protocol.getUrl(extra);

  const hydratedAddons = await hydrateAddonData(addons, { provider });

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

export function ensureFileItem<Extra>(
  item: StoragePersistentItem<Extra> | null,
  id: ObjectId
): asserts item is StorageFilePersistentItem<Extra> & {
  type: StorageItemType.FILE;
} {
  if (item === null) {
    throw new ApiError(`Storage item does not exist (id=${id})`, {
      code: 'base::entity/notFound',
    });
  }

  if (item.type !== StorageItemType.FILE) {
    throw new ApiError(`Storage item expected to be a file (id=${id})`, {
      code: 'base::schema/validation',
    });
  }
}

export async function ensureFileItemById(
  fileId: ObjectId,
  options?: AbortOptions
) {
  const item = await collection().findOne(
    { _id: fileId },
    { projection: { type: 1 }, signal: options?.signal }
  );

  ensureFileItem(item, fileId);
}

export async function getFileExtraById<Extra>(
  id: ObjectId,
  options?: AbortOptions
) {
  const item = await collection<Extra>().findOne(
    { _id: id },
    { projection: { type: 1, extra: 1 }, signal: options?.signal }
  );

  ensureFileItem(item, id);

  return item.extra;
}

export async function baseGetContent<Extra>(
  provider: StorageProvider<Extra>,
  id: ObjectId,
  options?: AbortOptions & { encoding?: BufferEncoding }
): Promise<Uint8Array | string> {
  const encoding = options?.encoding;
  const extra = await getFileExtraById<Extra>(id, options);

  const content = await provider.protocol.getContent(extra, options);

  if (encoding) {
    return Buffer.from(content).toString(encoding);
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

export function enhanceMime(name: string, mime: string) {
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

export async function deleteManyFilesViaProvider<Extra>(
  provider: StorageProvider<Extra>,
  extras: Extra[]
): Promise<StorageProviderDeleteManyResult> {
  const { protocol } = provider;

  if (protocol.deleteMany) {
    return protocol.deleteMany(extras);
  }

  const results = await Promise.allSettled(
    extras.map((extra) => protocol.delete(extra))
  );

  return {
    deletedStatuses: results.map((result) => {
      return result.status === 'fulfilled'
        ? { value: true }
        : // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          { value: false, reason: result.reason };
    }),
  };
}

export async function deleteManyFilesInCollection(values: { _id: ObjectId }[]) {
  await collection().deleteMany({
    _id: { $in: values.map(({ _id }) => _id) },
  });
}

export class FailedDeletionError extends Error {
  constructor(public readonly reasons: unknown[]) {
    super('Some files could not be deleted from storage provider');
  }
}

export async function baseUploadFile<Extra>(
  provider: StorageProvider<Extra>,
  payload: UploadFilePayload
) {
  const { protocol } = provider;
  const { mime, name, parent, hidden, content, originFile } = payload;
  const addons = getAddons();

  const enhancedPayload: UploadFilePayload = {
    ...payload,
    mime: enhanceMime(name, mime),
  };

  let addonData: StorageAddonPersistentDataMap = {};
  let uploadResult: StorageProviderUploadResult<Extra>;

  if (addons.length > 0) {
    const staticPayload = {
      ...enhancedPayload,
      content: content instanceof Readable ? await buffer(content) : content,
    };

    uploadResult = await protocol.upload(staticPayload);

    const context = { provider };
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

    addonData = fromEntriesNullable(addonEntries);
  } else {
    uploadResult = await protocol.upload(enhancedPayload);
  }

  const item: StorageFilePersistentItem<Extra> = {
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
}

export async function basePatchContent<Extra>(
  provider: StorageProvider<Extra>,
  id: ObjectId,
  content: FileSource,
  options?: AbortOptions
) {
  const storageCollection = collection<Extra>();

  const item = await storageCollection.findOne(
    { _id: id },
    { signal: options?.signal }
  );

  ensureFileItem(item, id);

  const size = await provider.protocol.patchContent(
    { content, extra: item.extra, mime: item.mime },
    options
  );

  await storageCollection.updateOne({ _id: id }, { $set: { size } });
}

export async function baseGetInfo<Extra>(
  provider: StorageProvider<Extra>,
  id: ObjectId,
  options?: AbortOptions
): Promise<StorageItemWithId<Extra> | null> {
  const result = await collection<Extra>().findOne(
    { _id: id },
    { signal: options?.signal }
  );

  return result && hydrateItem(provider, result);
}

export async function baseGetInfoMap<Extra>(
  provider: StorageProvider<Extra>,
  ids: ObjectId[],
  options?: AbortOptions
): Promise<Record<string, StorageItemWithId<Extra> | undefined>> {
  const result = await collection<Extra>()
    .find({ _id: { $in: ids } }, { signal: options?.signal })
    .toArray();

  const hydratedItems = await Promise.all(
    result.map((item) => hydrateItem(provider, item))
  );

  return Object.fromEntries(
    hydratedItems.map((item) => [item.id.toString(), item])
  );
}

export async function baseGetNameMap(
  ids: ObjectId[],
  options?: AbortOptions
): Promise<Record<string, string | undefined>> {
  const result = await collection()
    .find<{ _id: ObjectId; name: string }>(
      { _id: { $in: ids } },
      { projection: { name: 1 }, signal: options?.signal }
    )
    .toArray();

  return Object.fromEntries(
    result.map((item) => [item._id.toString(), item.name])
  );
}

export async function baseGetUrl<Extra>(
  provider: StorageProvider<Extra>,
  id: ObjectId,
  options?: AbortOptions
): Promise<string> {
  const extra = await getFileExtraById<Extra>(id, options);

  return provider.protocol.getUrl(extra);
}

export async function baseListItems<Extra>(
  provider: StorageProvider<Extra>,
  options: ListStorageItemsOptions & AbortOptions
) {
  const { parent, search } = options;
  let matchOperator: Document | undefined;
  let sortOperator: Document | undefined;

  if (parent) {
    (matchOperator ??= {}).parent =
      parent === 'no-parent' ? { $exists: false } : parent;
  }

  if (!options.includeHidden) {
    (matchOperator ??= {}).hidden = {
      $ne: true,
    };
  }

  if (search) {
    (matchOperator ??= {}).$text = { $search: search };
    (sortOperator ??= {}).score = { $meta: 'textScore' };
  }

  const { items, meta } = await getPage(collection<Extra>(), options, {
    pre: filterOutNullable([
      matchOperator && { $match: matchOperator },
      sortOperator && { $sort: sortOperator },
    ]),
  });

  const hydratedItems = await Promise.all(
    items.map((item) => hydrateItem(provider, item))
  );

  return { items: hydratedItems, meta };
}

export async function baseDeleteById<Extra>(
  provider: StorageProvider<Extra>,
  id: ObjectId,
  options?: DeleteStorageItemOptions
) {
  const appEvents = cms().service('base::appEvents');
  const refOrch = cms().service('base::referenceableOrchestrator');

  const storageCollection = collection<Extra>();

  const items = await storageCollection
    .find(
      { $or: [{ _id: id }, { originFile: id }] },
      { projection: { type: 1, extra: 1 } }
    )
    .toArray();

  if (items.some((item) => item.type === StorageItemType.FOLDER)) {
    await moveItemsToRoot(id);

    await storageCollection.deleteOne({ _id: id });

    appEvents.emit('base::storage::itemDeleted', {
      id,
      type: StorageItemType.FOLDER,
    });

    return;
  }

  const files = items.filter((item) => item.type === StorageItemType.FILE);

  const deletionResult = await deleteManyFilesViaProvider(
    provider,
    files.map(({ extra }) => extra)
  );

  let effectivelyDeletedFiles: { _id: ObjectId }[];

  // eslint-disable-next-line unicorn/prefer-ternary
  if (options?.force) {
    effectivelyDeletedFiles = files;
  } else {
    effectivelyDeletedFiles = files.filter(
      (_, index) => deletionResult.deletedStatuses[index].value
    );
  }

  await deleteManyFilesInCollection(effectivelyDeletedFiles);

  for (const { _id } of effectivelyDeletedFiles) {
    appEvents.emit('base::storage::itemDeleted', {
      id: _id,
      type: StorageItemType.FILE,
    });

    refOrch.emitDeleted({
      id: 'base::storageItem',
      data: {
        id: _id,
        type: StorageItemType.FILE,
      },
    });
  }

  if (!options?.force) {
    const failedDeletions = deletionResult.deletedStatuses
      .filter((status) => !status.value)
      .map((status) => status.reason);

    if (failedDeletions.length > 0) {
      throw new FailedDeletionError(failedDeletions);
    }
  }
}
