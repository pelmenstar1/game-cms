import { env } from '@game-cms/env';
import type { PageData } from '@game-cms/shared';
import { service } from '@game-cms/shared-api';
import type {
  DeleteFileOptions,
  ListFilesOptions,
  ServerStorageFile,
  ServerStorageFileMeta,
  UploadFilePayload,
} from '@game-cms/types';
import type { ClientSession, ObjectId } from 'mongodb';

import { getPage } from '../utils/paging.js';

function collection() {
  return cms.service('base::database').collection('base::files');
}

function storageProvider() {
  return env().config.storage.provider;
}

async function hydrateFile(file: ServerStorageFile) {
  const { mime, name, url } = file;
  const { size } = await storageProvider().protocol.getMeta(file);

  return { mime, name, url, size };
}

export default service({
  id: 'base::file',
  upload: async (payload: UploadFilePayload) => {
    const { mime, name, folderId } = payload;
    const { url, meta } = await storageProvider().protocol.upload(payload);

    const { insertedId } = await collection().insertOne({
      url,
      mime,
      name,
      folderId,
      providerMeta: meta,
    });

    return { id: insertedId, url };
  },
  getMeta: async (id: ObjectId): Promise<ServerStorageFileMeta | null> => {
    const file = await collection().findOne({ _id: id });
    if (file === null) {
      return null;
    }

    return hydrateFile(file);
  },
  list: async (
    options: ListFilesOptions
  ): Promise<PageData<ServerStorageFileMeta>> => {
    const { items, meta } = await getPage(collection(), options);

    return {
      items: await Promise.all(items.map((file) => hydrateFile(file))),
      meta,
    };
  },
  deleteById: async (id: ObjectId, options?: DeleteFileOptions) => {
    await cms.service('base::database').withTransaction(async (session) => {
      const file = await collection().findOne(
        { _id: id },
        { session, projection: { url: 1 } }
      );

      if (file !== null) {
        try {
          await storageProvider().protocol.delete(file.url);
        } catch (error) {
          if (!options?.force) {
            throw error;
          }
        }

        await collection().deleteOne({ _id: id }, { session });
      }
    });
  },
  moveFilesToRoot: async (folderId: ObjectId, session?: ClientSession) => {
    await collection().updateMany(
      { folderId },
      { $unset: { folderId: 1 } },
      { session }
    );
  },
});
