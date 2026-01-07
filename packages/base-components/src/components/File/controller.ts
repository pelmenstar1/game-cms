import { StorageItemType } from '@game-cms/base-core';
import { component } from '@game-cms/core';
import { cms } from '@game-cms/global';
import { ObjectId } from 'mongodb';

import { defaultRawData, meta, validator } from './shared.js';

export default component({
  meta,
  validator,
  defaultRawData,
  storageTransformer: {
    toStorage: (data) => data.map((item) => new ObjectId(item)),
    fromStorage: async (data) => {
      const storageService = cms().service('base::storage');

      return Promise.all(
        data.map(async (id) => {
          const item = await storageService.getInfo(id);

          if (item?.type !== StorageItemType.FILE) {
            throw new Error('Expected file');
          }

          const { name, mime, url } = item;

          return { id, name, mime, url };
        })
      );
    },
  },
});
