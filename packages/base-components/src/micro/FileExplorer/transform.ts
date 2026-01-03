import { StorageItemType, StorageItemWithMeta } from '@game-cms/base-types';
import { matchMime } from '@game-cms/shared';
import { ToClientType } from '@game-cms/types';

import { FileItem } from '../FileGrid/index.js';

export function transformItems(
  items: ToClientType<StorageItemWithMeta>[],
  visibleMimeTypes: string[] | undefined
) {
  return items
    .filter((item) => {
      if (item.type === StorageItemType.FILE) {
        return (
          visibleMimeTypes === undefined ||
          visibleMimeTypes.some((pattern) => matchMime(item.mime, pattern))
        );
      }

      return true;
    })
    .map((item): FileItem => {
      if (item.type === StorageItemType.FILE) {
        return { ...item, type: 'file' };
      }

      return { ...item, type: 'folder' };
    });
}
