import { PassThrough, Readable } from 'node:stream';

import {
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import type { StorageProvider } from '@game-cms/base-core';

import type { S3StorageProviderConfig } from './types.js';
import { createFileKey, getFileUrl } from './utils.js';

export * from './types.js';

type Extra = { key: string };

export function s3StorageProvider(
  config: S3StorageProviderConfig
): StorageProvider<Extra> {
  const { bucket } = config;
  const client = new S3Client(config.client);

  return {
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
