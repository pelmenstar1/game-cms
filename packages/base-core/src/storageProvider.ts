import type { Readable } from 'node:stream';

import type { UnknownApiRoute } from '@game-cms/core';
import type { MaybePromise } from '@game-cms/shared';

import type { UploadFileMeta } from './storage.js';

export type FileSource = Readable | string | Uint8Array;

export type UploadFileToProviderInfo = {
  name: string;
  mime: string;
  content: FileSource;
};

export type StorageProviderFileMeta = {
  size: number;
};

export type UploadFilePayload = UploadFileToProviderInfo & UploadFileMeta;

export interface StorageProviderProtocol {
  upload: (info: UploadFileToProviderInfo) => Promise<{ url: string }>;
  delete: (url: string) => Promise<void>;

  getMeta: (url: string) => Promise<StorageProviderFileMeta>;
  getContent: (url: string) => Promise<Uint8Array>;
}

export interface StorageProvider {
  init?: () => MaybePromise<void>;

  routes?: UnknownApiRoute[];
  protocol: StorageProviderProtocol;
}
