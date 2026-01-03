import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';

import send from '@fastify/send';
import {
  type StorageFileItem,
  StorageItemType,
  type StorageProvider,
} from '@game-cms/base-types';
import { ApiError } from '@game-cms/base-utils';
import { apiRoute } from '@game-cms/core';
import { cms } from '@game-cms/global';
import { isFileNotFoundError } from '@game-cms/shared/errors';
import z from 'zod';

import { createNewFileName } from './utils.js';

export type LocalStorageProviderConfig = {
  storagePath?: string;
};

const GET_ROUTE = `/storage/provider/get`;

function createFileUrl(fileName: string) {
  return encodeURI(`/api${GET_ROUTE}/${fileName}`);
}

function throwFileNotFound(): never {
  throw new ApiError('File not found', 'base::entity/notFound');
}

function getFileRoute(storagePath: string) {
  return apiRoute({
    url: `${GET_ROUTE}/:fileName`,
    method: 'GET',
    schema: {
      params: z.object({
        fileName: z.string(),
      }),
    },
    handler: async (req, res) => {
      const { fileName } = req.params;

      const storageInfo = await cms()
        .service('base::storage')
        .collection()
        .findOne({
          type: StorageItemType.FILE,
          url: createFileUrl(fileName),
        });

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
        'content-type': (storageInfo as StorageFileItem).mime,
      });
      stream.pipe(res.raw);
    },
  });
}

function getFilePath(storagePath: string, file: StorageFileItem | string) {
  const url = typeof file === 'string' ? file : file.url;

  const fileName = path.basename(url);

  return path.join(storagePath, fileName);
}

export function localStorageProvider(
  config?: LocalStorageProviderConfig
): StorageProvider {
  const storagePath = config?.storagePath ?? './.game-cms-storage';

  return {
    init: async () => {
      await fsp.mkdir(storagePath, { recursive: true });
    },
    routes: [getFileRoute(storagePath)],
    protocol: {
      upload: async (info) => {
        const fileName = createNewFileName(storagePath, info.name);
        const output = fs.createWriteStream(path.join(storagePath, fileName));

        await pipeline(info.content, output);

        return { url: createFileUrl(fileName) };
      },
      delete: async (url) => {
        const filePath = getFilePath(storagePath, url);

        try {
          await fsp.rm(filePath, { maxRetries: 3 });
        } catch (error) {
          if (!isFileNotFoundError(error)) {
            throw error;
          }
        }
      },
      getMeta: async (file) => {
        const filePath = getFilePath(storagePath, file);
        const stats = await fsp.stat(filePath);

        return { size: stats.size };
      },
      getContent: (file) => {
        return fsp.readFile(getFilePath(storagePath, file));
      },
    },
  };
}
