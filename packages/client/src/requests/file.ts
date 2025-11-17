import type {
  ClientFileUploadMeta,
  ClientListFilesOptions,
  ClientListFilesResponse,
  ClientStorageFileMeta,
  DeleteFileOptions,
  UploadFileResponse,
} from '@game-cms/types';

import { request, url } from '../internal/utils.js';
import { json } from '../responseParser.js';
import type { RequestContext } from '../types.js';

export interface ClientUploadFilePayload {
  content: Blob;
  filename: string;
  folderId?: string;
}

export const getFileMetaById = (context: RequestContext, fileId: string) =>
  request(context, {
    url: `/file/byId/${fileId}`,
    response: json<ClientStorageFileMeta>(),
  });

export const deleteFileById = (
  context: RequestContext,
  fileId: string,
  options?: DeleteFileOptions
) =>
  request(context, {
    url: url({
      path: `/file/byId/${fileId}`,
      search: options,
    }),
    method: 'DELETE',
  });

export const listFiles = (
  context: RequestContext,
  options: ClientListFilesOptions
) =>
  request(context, {
    url: url({
      path: `/file/list`,
      search: options,
    }),
    response: json<ClientListFilesResponse>(),
  });

export const uploadFile = (
  context: RequestContext,
  payload: ClientUploadFilePayload
) =>
  request(context, {
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
  });
