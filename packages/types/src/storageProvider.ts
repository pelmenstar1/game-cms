import type { Readable } from 'node:stream';

import type { MaybePromise, MimeType } from '@game-cms/shared';

import type { ApiRoute } from './api.js';
import type { ServerStorageFile } from './file.js';

export type UploadFileToProviderInfo = {
  name: string;
  mime: MimeType;
  content: Readable;
};

export type StorageProviderFileMeta = {
  size: number;
};

export interface StorageProviderProtocol<Meta = unknown> {
  upload: (
    info: UploadFileToProviderInfo
  ) => Promise<{ url: string; meta?: Meta }>;
  delete: (url: string) => Promise<void>;

  getMeta: (file: ServerStorageFile<Meta>) => Promise<StorageProviderFileMeta>;
  getContent?: (file: ServerStorageFile<Meta>) => Promise<Buffer>;
}

export interface StorageProvider<Meta = unknown> {
  init?: () => MaybePromise<void>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  routes?: ApiRoute<any, any, any, any, any, any, any>[];
  protocol: StorageProviderProtocol<Meta>;
}
