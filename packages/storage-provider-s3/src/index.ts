import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import type { StorageProvider } from '@game-cms/base-types';

import type { S3StorageProviderConfig } from './types.js';
import { createFileKey, getFileUrl } from './utils.js';

export * from './types.js';

function getKeyFromUrl(url: string) {
  const { pathname } = new URL(url);

  return pathname.slice(1);
}

export function s3StorageProvider(
  config: S3StorageProviderConfig
): StorageProvider {
  const { bucket } = config;
  const client = new S3Client(config.client);

  return {
    protocol: {
      upload: async (info) => {
        const key = createFileKey(info.mime);
        const upload = new Upload({
          client,
          params: {
            Bucket: bucket,
            Key: key,
            ContentType: info.mime,
            Body: info.content,
          },
        });

        await upload.done();

        return { url: getFileUrl(config, key) };
      },
      getMeta: async (url) => {
        const key = getKeyFromUrl(url);

        const result = await client.send(
          new HeadObjectCommand({
            Bucket: bucket,
            Key: key,
          })
        );

        return { size: result.ContentLength ?? 0 };
      },
      delete: async (url) => {
        const key = getKeyFromUrl(url);

        await client.send(
          new DeleteObjectCommand({
            Bucket: bucket,
            Key: key,
          })
        );
      },
      getContent: async (url) => {
        const key = getKeyFromUrl(url);

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
