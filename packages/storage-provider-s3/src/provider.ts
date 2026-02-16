import { Readable } from 'node:stream';

import {
  DeleteObjectCommand,
  GetObjectCommand,
  NoSuchKey,
  S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { FileSource, type StorageProvider } from '@game-cms/base-core';
import { ApiError, apiRoute } from '@game-cms/core/api';
import { meteredStream } from '@game-cms/shared/node/io';
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

async function baseUpload(
  client: S3Client,
  bucket: string,
  key: string,
  content: FileSource,
  mime: string,
  signal?: AbortSignal
) {
  const stream = meteredStream(content);

  const upload = new Upload({
    client,
    params: {
      Bucket: bucket,
      Key: key,
      ContentType: mime,
      Body: stream.body,
    },
  });

  const abortCallback = () => {
    void upload.abort();
  };

  signal?.addEventListener('abort', abortCallback);

  await upload.done();

  signal?.removeEventListener('abort', abortCallback);

  return stream.size;
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
      upload: async (info, options) => {
        const { name, mime, content } = info;
        const key = createFileKey(mime, name);

        const size = await baseUpload(
          client,
          bucket,
          key,
          content,
          mime,
          options?.signal
        );

        return { extra: { key }, size };
      },
      patchContent: async (info, options) => {
        const { extra, content, mime } = info;

        const size = await baseUpload(
          client,
          bucket,
          extra.key,
          content,
          mime,
          options?.signal
        );

        return { size };
      },
      delete: async ({ key }) => {
        await client.send(
          new DeleteObjectCommand({
            Bucket: bucket,
            Key: key,
          })
        );
      },
      getContent: async ({ key }, options) => {
        const result = await client.send(
          new GetObjectCommand({ Bucket: bucket, Key: key }),
          { abortSignal: options?.signal }
        );

        if (result.Body) {
          return result.Body.transformToByteArray();
        }

        return new Uint8Array();
      },
    },
  };
}
