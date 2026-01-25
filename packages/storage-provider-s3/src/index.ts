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

        // TODO: Fix size
        return { extra: { key }, size: 0 };
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
