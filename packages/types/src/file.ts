import { objectId } from '@game-cms/shared/mongo';
import z from 'zod';

import { pagingOptionsSchema } from './paging.js';
import type { UploadFileToProviderInfo } from './storageProvider.js';
import type { ToClientType } from './typeutil.js';

const storageFile = z.object({
  name: z.string(),
  mime: z.string(),
  url: z.string(),
});

export const serverStorageFile = storageFile;

export const clientStorageFile = storageFile;

export type ServerStorageFile<ProviderMeta = unknown> = z.infer<
  typeof serverStorageFile
> & {
  providerMeta?: ProviderMeta;
};

export type ClientStorageFile = z.infer<typeof clientStorageFile>;

export const serverStorageFileMeta = z.object({
  ...serverStorageFile.shape,
  size: z.number(),
});

export type ServerStorageFileMeta = z.infer<typeof serverStorageFileMeta>;

export const clientStorageFileMeta = z.object({
  ...clientStorageFile.shape,
  size: z.number(),
});

export type ClientStorageFileMeta = z.infer<typeof clientStorageFileMeta>;

export const uploadFileMeta = z.object({
  folderId: objectId.optional(),
});

export type UploadFileMeta = z.infer<typeof uploadFileMeta>;

export type ClientFileUploadMeta = ToClientType<UploadFileMeta>;

export type UploadFilePayload = UploadFileToProviderInfo & UploadFileMeta;

export const uploadFileResponse = z.object({
  id: z.string(),
  url: z.string(),
});

export type UploadFileResponse = z.infer<typeof uploadFileResponse>;

export const listFilesOptions = z.object({
  ...pagingOptionsSchema.shape,
  search: z.string().optional(),
});

export type ListFilesOptions = z.infer<typeof listFilesOptions>;

export const listFilesResponse = z.object({
  items: z.array(serverStorageFileMeta),
  meta: z.object({
    totalCount: z.number(),
  }),
});

export type ListFilesResponse = z.infer<typeof listFilesResponse>;

export const deleteFileOptions = z.object({
  force: z.boolean().optional(),
});

export type DeleteFileOptions = z.infer<typeof deleteFileOptions>;
