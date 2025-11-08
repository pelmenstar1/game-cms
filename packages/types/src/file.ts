import { objectId, stringObjectId } from '@game-cms/shared/mongo';
import z from 'zod';

import { pagingOptionsSchema } from './paging.js';
import type { UploadFileToProviderInfo } from './storageProvider.js';
import type { ToClientType } from './typeutil.js';

export const serverStorageFile = z.object({
  name: z.string(),
  mime: z.string(),
  url: z.string(),
  folderId: objectId.optional(),
});

export type ServerStorageFile<ProviderMeta = unknown> = z.infer<
  typeof serverStorageFile
> & {
  providerMeta?: ProviderMeta;
};

export type ClientStorageFile = Omit<
  ToClientType<ServerStorageFile>,
  'providerMeta'
>;

export const serverStorageFileMeta = z.object({
  ...serverStorageFile.shape,
  size: z.number(),
});

export type ServerStorageFileMeta = z.infer<typeof serverStorageFileMeta>;

export interface ClientStorageFileMeta extends ClientStorageFile {
  size: number;
}

export const uploadFileMeta = z.object({
  folderId: stringObjectId.optional(),
});

export type UploadFileMeta = z.infer<typeof uploadFileMeta>;

export type ClientFileUploadMeta = ToClientType<UploadFileMeta>;

export type UploadFilePayload = UploadFileToProviderInfo & UploadFileMeta;

export const uploadFileResponse = z.object({
  id: objectId,
  url: z.string(),
});

export type UploadFileResponse = z.infer<typeof uploadFileResponse>;

export const listFilesOptions = z.object({
  ...pagingOptionsSchema.shape,
  folderId: stringObjectId.optional(),
  search: z.string().optional(),
  recursive: z.boolean().optional(),
});

export type ListFilesOptions = z.infer<typeof listFilesOptions>;
export type ClientListFilesOptions = ToClientType<ListFilesOptions>;

export const listFilesResponse = z.object({
  items: z.array(serverStorageFileMeta),
  meta: z.object({
    totalCount: z.number(),
  }),
});

export type ListFilesResponse = z.infer<typeof listFilesResponse>;
export type ClientListFilesResponse = ToClientType<ListFilesResponse>;

export const deleteFileOptions = z.object({
  force: z.boolean().optional(),
});

export type DeleteFileOptions = z.infer<typeof deleteFileOptions>;
