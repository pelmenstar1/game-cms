import type { Readable } from 'node:stream';

import type { UnknownApiRoute } from '@game-cms/core';
import type { MaybePromise } from '@game-cms/shared';

import type { StorageFileItem, UploadFileMeta } from './storage.js';

export type UploadFileToProviderInfo = {
  name: string;
  mime: string;
  content: Readable;
};

export type StorageProviderFileMeta = {
  size: number;
};

export type UploadFilePayload = UploadFileToProviderInfo & UploadFileMeta;

export interface StorageProviderProtocol {
  upload: (info: UploadFileToProviderInfo) => Promise<{ url: string }>;
  delete: (url: string) => Promise<void>;

  getMeta: (file: StorageFileItem) => Promise<StorageProviderFileMeta>;
  getContent?: (file: StorageFileItem) => Promise<Buffer>;
}

export interface StorageProvider {
  init?: () => MaybePromise<void>;

  routes?: UnknownApiRoute[];
  protocol: StorageProviderProtocol;
}
