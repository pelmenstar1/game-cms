import { randomUUID } from 'node:crypto';
import fsp from 'node:fs/promises';
import path from 'node:path';

import send from '@fastify/send';
import type {
  StorageFilePersistentItem,
  StorageProvider,
} from '@game-cms/base-core';
import { ApiError, apiRoute } from '@game-cms/core/api';
import { cms } from '@game-cms/global';
import { isFileNotFoundError } from '@game-cms/shared/node';
import { inferFileExtensionFromMime } from '@game-cms/shared/node';
import z from 'zod';

import { writeFileSourceToFile } from './utils.js';

export type LocalStorageProviderConfig = {
  storagePath?: string;
};

type Extra = { fileName: string };

const GET_ROUTE = '/storage/file/get';

function throwFileNotFound(): never {
  throw new ApiError('File not found', 'base::entity/notFound');
}

function collection() {
  return cms().service('base::storage').collection();
}

function getFileRoute(storagePath: string) {
  return apiRoute({
    url: `${GET_ROUTE}/:fileName`,
    method: 'GET',
    config: {
      id: 'storage/file$get',
    },
    schema: {
      params: z.object({
        fileName: z.string(),
      }),
    },
    handler: async (req, res) => {
      const { fileName } = req.params;

      const storageInfo = await collection().findOne(
        {
          extra: { fileName },
        },
        { projection: { mime: 1 } }
      );

      if (storageInfo === null) {
        throwFileNotFound();
      }

      const { headers, statusCode, stream } = await send(req.raw, fileName, {
        root: storagePath,
        contentType: false,
      });

      if (statusCode === 404) {
        throwFileNotFound();
      }

      res.raw.writeHead(statusCode, {
        ...headers,
        'content-type': (storageInfo as StorageFilePersistentItem).mime,
      });
      stream.pipe(res.raw);
    },
  });
}

function getFilePath(storagePath: string, extra: Extra) {
  return path.join(storagePath, extra.fileName);
}

export function localStorageProvider(
  config?: LocalStorageProviderConfig
): StorageProvider<Extra> {
  const storagePath = config?.storagePath ?? './.game-cms-storage';

  return {
    init: async () => {
      await fsp.mkdir(storagePath, { recursive: true });

      await collection().createIndex({ 'extra.fileName': 1 }, { unique: true });
    },
    meta: {
      deterministicUrls: true,
    },
    routes: [getFileRoute(storagePath)],
    protocol: {
      getUrl: ({ fileName }) => encodeURI(`/api${GET_ROUTE}/${fileName}`),
      upload: async ({ name, mime, content }, options) => {
        const extension = inferFileExtensionFromMime(mime, name);
        let outputName: string;

        let size: number = 0;

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        while (true) {
          const uuid = randomUUID();
          outputName = `${uuid}${extension}`;

          const filePath = path.join(storagePath, outputName);

          try {
            size = await writeFileSourceToFile(content, filePath, {
              flag: 'wx',
              signal: options?.signal,
            });

            break;
          } catch (error: unknown) {
            if (!isFileNotFoundError(error)) {
              throw error;
            }
          }
        }

        return { extra: { fileName: outputName }, size };
      },
      patchContent: async (info, options) => {
        const filePath = getFilePath(storagePath, info.extra);

        const size = await writeFileSourceToFile(info.content, filePath, {
          flag: 'r+',
          signal: options?.signal,
        });

        return { size };
      },
      delete: async (extra) => {
        const filePath = getFilePath(storagePath, extra);

        try {
          await fsp.rm(filePath, { maxRetries: 3 });
        } catch (error) {
          if (!isFileNotFoundError(error)) {
            throw error;
          }
        }
      },
      getContent: (extra, options) => {
        const filePath = getFilePath(storagePath, extra);

        return fsp.readFile(filePath, {
          signal: options?.signal,
        });
      },
    },
  };
}
