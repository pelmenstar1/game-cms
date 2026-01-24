import fsp from 'node:fs/promises';
import path from 'node:path';

import send from '@fastify/send';
import type { StorageFileItem, StorageProvider } from '@game-cms/base-core';
import { ApiError } from '@game-cms/base-core';
import { apiRoute } from '@game-cms/core/api';
import { cms } from '@game-cms/global';
import { isFileNotFoundError } from '@game-cms/shared/errors';
import z from 'zod';

import { createNewFileName } from './utils.js';

export type LocalStorageProviderConfig = {
  storagePath?: string;
};

type Extra = { fileName: string };

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
        .findOne(
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
        'content-type': (storageInfo as StorageFileItem).mime,
      });
      stream.pipe(res.raw);
    },
  });
}

export function localStorageProvider(
  config?: LocalStorageProviderConfig
): StorageProvider<Extra> {
  const storagePath = config?.storagePath ?? './.game-cms-storage';

  return {
    init: async () => {
      await fsp.mkdir(storagePath, { recursive: true });
    },
    routes: [getFileRoute(storagePath)],
    protocol: {
      getUrl: ({ fileName }) => createFileUrl(fileName),
      upload: async ({ name, content }) => {
        const fileName = createNewFileName(storagePath, name);
        const outputPath = path.join(storagePath, fileName);

        await fsp.writeFile(outputPath, content);

        return { fileName };
      },
      delete: async ({ fileName }) => {
        const filePath = path.join(storagePath, fileName);

        try {
          await fsp.rm(filePath, { maxRetries: 3 });
        } catch (error) {
          if (!isFileNotFoundError(error)) {
            throw error;
          }
        }
      },
      getMeta: async ({ fileName }) => {
        const filePath = path.join(storagePath, fileName);
        const stats = await fsp.stat(filePath);

        return { size: stats.size };
      },
      getContent: ({ fileName }) => {
        return fsp.readFile(path.join(storagePath, fileName));
      },
    },
  };
}
