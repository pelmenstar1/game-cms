import { StorageItemType } from '@game-cms/base-types';
import { getStorageItemInfo } from '@game-cms/client';
import { ComponentClientDataResolver } from '@game-cms/types';

import { FileClientDataItem } from './types.js';

export const clientResolver: ComponentClientDataResolver<'base::file'> = {
  getDefaultData: () => ({ items: [] }),
  toClient: async (data, _, context) => {
    const items = await Promise.all(
      data.items.map(async (storageId): Promise<FileClientDataItem> => {
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

    return { items };
  },
  fromClient: (clientData) => {
    return {
      result: {
        items: clientData.items.map((item) => item.id),
      },
    };
  },
};
