import type {
  ClientFileUploadMeta,
  ClientStorageFileMeta,
  DeleteFileOptions,
  ListFilesOptions,
  ListFilesResponse,
  UploadFileResponse,
} from '@game-cms/types';

import { request } from '../internal/utils.js';
import { json } from '../responseParser.js';

export interface ClientUploadFilePayload {
  content: Blob;
  filename: string;
  folderId?: string;
}

export const getFileMetaById = request((fileId: string) => ({
  url: `/file/byId/${fileId}`,
  response: json<ClientStorageFileMeta>(),
}));

export const deleteFileById = request(
  (fileId: string, options?: DeleteFileOptions) => ({
    url: {
      path: `/file/byId/${fileId}`,
      search: options,
    },
    method: 'DELETE',
  })
);

export const listFiles = request((options: ListFilesOptions) => ({
  url: {
    path: `/file/list`,
    search: options,
  },
  response: json<ListFilesResponse>(),
}));

export const uploadFile = request((payload: ClientUploadFilePayload) => ({
  url: '/file',
  method: 'POST',
  body: (init) => {
    const { content, filename, folderId } = payload;

    const formData = new FormData();

    formData.set('file', content, filename);

    if (folderId !== undefined) {
      const fileMeta: ClientFileUploadMeta = { folderId };

      formData.set('meta', JSON.stringify(fileMeta));
    }

    init.body = formData;
  },
  response: json<UploadFileResponse>(),
}));
