import { randomUUID } from 'node:crypto';

import { extension } from 'mime-types';

import type { S3StorageProviderConfig } from './types.js';

export function getFileUrl(config: S3StorageProviderConfig, key: string) {
  return new URL(key, config.publicUrl).toString();
}

export function createFileKey(mime: string) {
  const id = randomUUID();
  const ext = extension(mime);

  return ext ? `${id}.${ext}` : id;
}
