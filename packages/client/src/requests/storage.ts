import type {
  ClientFileUploadMeta,
  DeleteStorageItemOptions,
  ListStorageItemsOptions,
  ListStorageItemsResponse,
  UploadFileResponse,
} from '@game-cms/base-types';
import type { ToClientType } from '@game-cms/types';

import { request, url } from '../internal/utils.js';
import { json } from '../responseParser.js';
import type { RequestContext } from '../types.js';

export interface ClientUploadFilePayload {
  content: Blob;
  filename: string;
  folderId?: string;
}

export const deleteStorageItemById = (
  context: RequestContext,
  fileId: string,
  options?: DeleteStorageItemOptions
) =>
  request(context, {
    url: url({
      path: `/storage/byId/${fileId}`,
      search: options,
    }),
    method: 'DELETE',
  });

export const listStorageItems = (
  context: RequestContext,
  options: ToClientType<ListStorageItemsOptions>
) =>
  request(context, {
    url: url({
      path: `/storage/list`,
      search: options,
    }),
    response: json<ToClientType<ListStorageItemsResponse>>(),
  });

export const uploadFile = (
  context: RequestContext,
  payload: ClientUploadFilePayload
): Promise<UploadFileResponse> =>
  request(context, {
    url: '/storage/file',
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
    response: json(),
  });
