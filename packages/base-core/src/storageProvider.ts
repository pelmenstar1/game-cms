import type { Readable } from 'node:stream';

import type { UnknownApiRoute } from '@game-cms/core/api';
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

export interface StorageProviderProtocol<Extra> {
  upload: (info: UploadFileToProviderInfo) => Promise<Extra>;
  delete: (extra: Extra) => Promise<void>;
  getUrl: (extra: Extra) => string;
  getMeta: (extra: Extra) => Promise<StorageProviderFileMeta>;
  getContent: (extra: Extra) => Promise<Uint8Array>;
}

export interface StorageProvider<Extra = unknown> {
  init?: () => MaybePromise<void>;

  routes?: UnknownApiRoute[];
  protocol: StorageProviderProtocol<Extra>;
}
