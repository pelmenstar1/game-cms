import { randomUUID } from 'node:crypto';

import { inferFileExtensionFromMime } from '@game-cms/shared/node';

import type { S3StorageProviderConfig } from './types.js';

export const GET_ROUTE = '/storage/file/get';

export function getFileUrl(config: S3StorageProviderConfig, key: string) {
  const { publicUrl } = config;

  if (publicUrl !== undefined) {
    return new URL(key, publicUrl).toString();
  }

  return `/api${GET_ROUTE}/${key}`;
}

export function createFileKey(mime: string, name: string) {
  const extension = inferFileExtensionFromMime(mime, name);
  const id = randomUUID();

  return `${id}${extension}`;
}
