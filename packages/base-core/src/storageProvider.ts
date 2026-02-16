import type { Readable } from 'node:stream';

import type { UnknownApiRoute } from '@game-cms/core/api';
import type { MaybePromise } from '@game-cms/shared';

import type { UploadFileMeta } from './storage.js';
import { AbortOptions } from './types.js';

export type StaticFileSource = Uint8Array;
export type FileSource = StaticFileSource | Readable;

export type UploadFileToProviderInfo<Source extends FileSource = FileSource> = {
  name: string;
  mime: string;
  content: Source;
};

export type UploadFilePayload<Source extends FileSource = FileSource> =
  UploadFileToProviderInfo<Source> & UploadFileMeta;

export type PatchFileInfo<
  Source extends FileSource = FileSource,
  Extra = unknown,
> = {
  mime: string;
  content: Source;
  extra: Extra;
};

export interface StorageProviderProtocol<Extra> {
  upload: (
    info: UploadFileToProviderInfo,
    options?: AbortOptions
  ) => Promise<{ extra: Extra; size: number }>;

  patchContent: (
    info: PatchFileInfo<FileSource, Extra>,
    options?: AbortOptions
  ) => Promise<{ size: number }>;

  delete: (extra: Extra) => Promise<void>;
  getUrl: (extra: Extra) => string;
  getContent: (extra: Extra, options?: AbortOptions) => Promise<Uint8Array>;
}

/**
 * Provides interface for storing and retrieving files.
 *
 * Caveats:
 * - It's really important (ex. file cross-referencing) to have flat URL structure, meaning that files in different folders is on the same directory level.
 */
export interface StorageProvider<Extra = unknown> {
  init?: () => MaybePromise<void>;

  routes?: UnknownApiRoute[];
  protocol: StorageProviderProtocol<Extra>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyStorageProvider = StorageProvider<any>;
