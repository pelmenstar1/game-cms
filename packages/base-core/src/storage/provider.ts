import type { UnknownApiRoute } from '@game-cms/core/api';
import type { MaybePromise } from '@game-cms/shared';
import type { FileSource } from '@game-cms/shared/node';

import { AbortOptions } from '../types.js';
import type { UploadFileMeta } from './core.js';

interface ContentWitType<Source extends FileSource> {
  mime: string;
  content: Source;
}

export interface UploadFileToProviderInfo<
  Source extends FileSource = FileSource,
> extends ContentWitType<Source> {
  name: string;
}

export type UploadFilePayload<Source extends FileSource = FileSource> =
  UploadFileToProviderInfo<Source> & UploadFileMeta;

export interface PatchFileInfo<
  Source extends FileSource = FileSource,
  Extra = unknown,
> extends ContentWitType<Source> {
  extra: Extra;
}

export type StorageProviderUploadResult<Extra> = {
  extra: Extra;
  size: number;
};

export type StorageProviderDeleteManyResult = {
  deletedStatuses: ({ value: true } | { value: false; reason?: unknown })[];
};

export interface StorageProviderProtocol<Extra> {
  upload: (
    info: UploadFileToProviderInfo,
    options?: AbortOptions
  ) => Promise<StorageProviderUploadResult<Extra>>;

  patchContent: (
    info: PatchFileInfo<FileSource, Extra>,
    options?: AbortOptions
  ) => Promise<{ size: number }>;

  delete: (extra: Extra) => Promise<void>;
  deleteMany?: (extra: Extra[]) => Promise<StorageProviderDeleteManyResult>;

  getUrl: (extra: Extra) => MaybePromise<string>;
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

  meta?: {
    deterministicUrls?: boolean;
  };
  routes?: UnknownApiRoute[];
  protocol: StorageProviderProtocol<Extra>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyStorageProvider = StorageProvider<any>;
