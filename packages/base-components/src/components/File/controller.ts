import { StorageItemType } from '@game-cms/base-core';
import { componentController } from '@game-cms/core';
import { cms } from '@game-cms/global';
import { ObjectId } from 'mongodb';

import core from './core.js';

export default componentController({
  core,
  migrate: (data) => {
    if (
      Array.isArray(data) &&
      data.every((value) => value instanceof ObjectId)
    ) {
      return data;
    }
  },
  storageTransformer: {
    getDefaultData: () => [],
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
