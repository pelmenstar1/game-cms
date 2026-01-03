import { StorageItemType } from '@game-cms/base-types';
import { getStorageItemInfo } from '@game-cms/client';
import { ComponentClientDataResolver } from '@game-cms/core';

import { FileClientDataItem } from './types.js';

export const clientResolver: ComponentClientDataResolver<'base::file'> = {
  getDefaultData: () => [],
  toClient: (data, _, context) => {
    return Promise.all(
      data.map(async (storageId): Promise<FileClientDataItem> => {
        const result = await context.makeRequest(getStorageItemInfo, [
          storageId,
        ]);

        if (result.type !== StorageItemType.FILE) {
          throw new Error('Expected a file in base::file');
        }

        return {
          id: result.id,
          name: result.name,
          mime: result.mime,
          url: result.url,
        };
      })
    );
  },
  fromClient: (clientData) => {
    return {
      result: clientData.map((item) => item.id),
    };
  },
};
