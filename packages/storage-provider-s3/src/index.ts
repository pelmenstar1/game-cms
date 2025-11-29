import path from 'node:path';

import {
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import type { StorageProvider } from '@game-cms/base-types';

import type { S3StorageProviderConfig } from './types.js';
import { createFileKey, getFileUrl } from './utils.js';

export * from './types.js';

export function s3StorageProvider(
  config: S3StorageProviderConfig
): StorageProvider {
  const { bucket } = config;
  const client = new S3Client(config.client);

  return {
    protocol: {
      upload: async (info) => {
        const key = createFileKey(info.mime);

        await client.send(
          new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            ContentType: info.mime,
            Body: info.content,
          })
        );

        return { url: getFileUrl(config, key) };
      },
      getMeta: async (file) => {
        const key = path.basename(file.url);

        const result = await client.send(
          new HeadObjectCommand({
            Bucket: bucket,
            Key: key,
          })
        );

        return { size: result.ContentLength ?? 0 };
      },
      delete: async (url) => {
        const key = path.basename(url);

        await client.send(
          new DeleteObjectCommand({
            Bucket: bucket,
            Key: key,
          })
        );
      },
    },
  };
}
