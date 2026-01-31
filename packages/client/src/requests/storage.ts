import type {
  CreateFolderPayload,
  DeleteStorageItemOptions,
  ListStorageItemsOptions,
  ListStorageItemsResponse,
  StorageItem,
  UploadFileMeta,
  UploadFileResponse,
} from '@game-cms/base-core';
import type { ToClientType } from '@game-cms/core';
import { json, type RequestContext } from '@game-cms/core/api';

import { url } from '../internal/utils.js';
import { jsonInit } from '../requestInitializer.js';
import { request } from '../utils.js';

export interface ClientUploadFilePayload {
  content: Blob;
  filename: string;
  parent?: string;
  hidden?: boolean;
}

export const getStorageItemInfo = (
  context: RequestContext,
  id: string
): Promise<ToClientType<StorageItem>> =>
  request(context, {
    url: `/storage/byId/${id}`,
    method: 'GET',
    response: json(),
  });

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
): Promise<ToClientType<UploadFileResponse>> =>
  request(context, {
    url: '/storage/file',
    method: 'POST',
    body: (init) => {
      const { content, filename, parent, hidden } = payload;

      const formData = new FormData();
      formData.set('file', content, filename);

      const fileMeta: ToClientType<UploadFileMeta> = { parent, hidden };

      if (parent !== undefined || hidden !== undefined) {
        formData.set('meta', JSON.stringify(fileMeta));
      }

      init.body = formData;
    },
    response: json(),
  });

export const createFolder = (
  context: RequestContext,
  payload: ToClientType<CreateFolderPayload>
) =>
  request(context, {
    url: '/storage/folder',
    method: 'POST',
    body: jsonInit(payload),
    response: json(),
  });
