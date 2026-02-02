import { PassThrough, Readable } from 'node:stream';

import {
  DeleteObjectCommand,
  GetObjectCommand,
  NoSuchKey,
  S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { ApiError, type StorageProvider } from '@game-cms/base-core';
import { apiRoute } from '@game-cms/core/api';
import { stripUndefined } from '@game-cms/shared/object';
import z from 'zod';

import type { S3StorageProviderConfig } from './types.js';
import { createFileKey, GET_ROUTE, getFileUrl } from './utils.js';

type Extra = { key: string };

function getFileRoute(config: S3StorageProviderConfig, client: S3Client) {
  return apiRoute({
    url: `${GET_ROUTE}/:key`,
    method: 'GET',
    config: {
      id: 'storage/file$get',
    },
    schema: {
      params: z.object({
        key: z.string(),
      }),
    },
    handler: async (req, res) => {
      const { key } = req.params;

      try {
        const object = await client.send(
          new GetObjectCommand({ Bucket: config.bucket, Key: key })
        );

        res.raw.writeHead(
          200,
          stripUndefined({
            'content-length': object.ContentLength?.toString(),
            'content-type': object.ContentType,
            'content-disposition': object.ContentDisposition,
            'content-encoding': object.ContentEncoding,
            'content-language': object.ContentLanguage,
            'cache-control': object.CacheControl,
            etag: object.ETag,
            expires: object.ExpiresString,
          })
        );

        if (object.Body instanceof Readable) {
          object.Body.pipe(res.raw);
        }
      } catch (error) {
        if (error instanceof NoSuchKey) {
          throw new ApiError('File not found', 'base::entity/notFound');
        }

        throw error;
      }
    },
  });
}

export function s3StorageProvider(
  config: S3StorageProviderConfig
): StorageProvider<Extra> {
  const { bucket } = config;
  const client = new S3Client(config.client);

  return {
    routes: [getFileRoute(config, client)],
    protocol: {
      getUrl: ({ key }) => getFileUrl(config, key),
      upload: async (info) => {
        const { mime, content } = info;

        const key = createFileKey(mime);

        let size = 0;
        let body: Readable | Uint8Array;

        if (content instanceof Readable) {
          const pass = new PassThrough();

          pass.on('data', (chunk: { length: number }) => {
            size += chunk.length;
          });

          content.pipe(pass);

          body = pass;
        } else {
          body = content;
          size = content.length;
        }

        const upload = new Upload({
          client,
          params: {
            Bucket: bucket,
            Key: key,
            ContentType: mime,
            Body: body,
          },
        });

        await upload.done();

        return { extra: { key }, size };
      },
      delete: async ({ key }) => {
        await client.send(
          new DeleteObjectCommand({
            Bucket: bucket,
            Key: key,
          })
        );
      },
      getContent: async ({ key }) => {
        const result = await client.send(
          new GetObjectCommand({ Bucket: bucket, Key: key })
        );

        if (result.Body) {
          return result.Body.transformToByteArray();
        }

        return new Uint8Array();
      },
    },
  };
}
