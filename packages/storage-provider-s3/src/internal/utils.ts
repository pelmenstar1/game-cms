import { randomUUID } from 'node:crypto';

import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { resolveMaybeFactory } from '@game-cms/shared';
import {
  type FileSource,
  inferFileExtensionFromMime,
  meteredStream,
} from '@game-cms/shared/node';

import { GET_ROUTE } from './constants.js';
import { S3ClientWithConfig } from './types.js';

export function getFileUrl(client: S3ClientWithConfig, key: string) {
  const { publicUrl, presignConfig: rawPresignConfig } = client.config;

  const { enabled: presignEnabled, ...presignArgs } =
    resolveMaybeFactory(rawPresignConfig) ?? {};

  if (presignEnabled) {
    const command = new GetObjectCommand({
      Bucket: client.config.bucket,
      Key: key,
    });

    return getSignedUrl(client.client, command, presignArgs);
  }

  if (publicUrl !== undefined) {
    return new URL(key, publicUrl).href;
  }

  return `/api${GET_ROUTE}/${key}`;
}

export function createFileKey(mime: string, name: string) {
  const extension = inferFileExtensionFromMime(mime, name);
  const id = randomUUID();

  return `${id}${extension}`;
}

export async function baseUpload(
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
