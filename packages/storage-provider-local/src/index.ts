import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';

import type { ServerStorageFile, StorageProvider } from '@game-cms/base-types';
import { ApiError } from '@game-cms/base-utils';
import { sendFile } from '@game-cms/shared';
import { isFileNotFoundError } from '@game-cms/shared/errors';
import { apiRoute } from '@game-cms/utils';
import z from 'zod';

import { resolveNewFilePath } from './utils.js';

export type LocalStorageProviderConfig = {
  storagePath?: string;
};

const GET_ROUTE = `/file/provider/get`;

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
      if (fileName.includes('/') || fileName.includes('\\')) {
        throw new ApiError('Unknown file', 'base::entity/notFound');
      }

      const filePath = path.join(storagePath, fileName);

      await sendFile(res, filePath);
    },
  });
}

function getFilePath(storagePath: string, file: ServerStorageFile | string) {
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
        const filePath = resolveNewFilePath(storagePath);
        const fileName = path.basename(filePath);

        const output = fs.createWriteStream(filePath);

        await pipeline(info.content, output);

        return { url: encodeURI(`/api${GET_ROUTE}/${fileName}`) };
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
