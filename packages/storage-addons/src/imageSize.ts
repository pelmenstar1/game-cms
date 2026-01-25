import { storageAddon } from '@game-cms/base-core';
import type { Size } from '@game-cms/shared';

import { tryGetImageMeta } from './utils.js';

declare module '@game-cms/base-core' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface StorageAddonTypeMap<Extra> {
    imageSize: {
      optional: true;
      hydrated: Size;
      persistent: Size;
    };
  }
}

export function imageSize() {
  return storageAddon({
    id: 'imageSize',
    getData: async (item) => {
      const meta = await tryGetImageMeta(item.content);

      if (meta) {
        return { width: meta.width, height: meta.height };
      }
    },
    hydrateData: (data) => data,
  });
}
