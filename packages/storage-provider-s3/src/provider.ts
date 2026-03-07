import {
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { StorageProvider } from '@game-cms/base-core';
import { resolveMaybeFactory } from '@game-cms/shared';

import { getFileRoute } from './internal/getRoute.js';
import { baseUpload, createFileKey, getFileUrl } from './internal/utils.js';
import { S3StorageProviderConfig } from './types.js';

type Extra = { key: string };

export function s3StorageProvider(
  config: S3StorageProviderConfig
): StorageProvider<Extra> {
  const { bucket } = config;
  const client = new S3Client(config.client);

  const presignConfig = resolveMaybeFactory(config.presignConfig);

  return {
    meta: {
      deterministicUrls: !(presignConfig?.enabled ?? false),
    },
    routes: [getFileRoute(config, client)],
    protocol: {
      getUrl: ({ key }) => getFileUrl({ client, config }, key),
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
