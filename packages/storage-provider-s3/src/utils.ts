import { randomUUID } from 'node:crypto';

import { extension } from 'mime-types';

import type { S3StorageProviderConfig } from './types.js';

export const GET_ROUTE = '/storage/file/get';

export function getFileUrl(config: S3StorageProviderConfig, key: string) {
  const { publicUrl } = config;

  if (publicUrl !== undefined) {
    return new URL(key, publicUrl).toString();
  }

  return `/api${GET_ROUTE}/${key}`;
}

export function createFileKey(mime: string) {
  const id = randomUUID();
  const ext = extension(mime);

  return ext ? `${id}.${ext}` : id;
}
