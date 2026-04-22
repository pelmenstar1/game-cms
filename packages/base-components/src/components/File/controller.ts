import { StorageItemType } from '@game-cms/base-core';
import { defineComponentController } from '@game-cms/core';
import { cms } from '@game-cms/global';
import { filterOutNullable } from '@game-cms/shared/collections';
import {
  combineTextIndexes,
  computeHybridScore,
  createTextIndex,
} from '@game-cms/shared/search';
import { ObjectId } from 'mongodb';

import core from './core.js';
import { validator } from './validator.js';

export default defineComponentController({
  core,
  validator: (data, options) =>
    validator(data, options, (item) => typeof item === 'string'),
  migrate: (data) => {
    if (
      Array.isArray(data) &&
      data.every((value) => value instanceof ObjectId)
    ) {
      return data;
    }
  },
  search: {
    createIndex: async (data) => {
      const nameMap = await cms().service('base::storage').getNameMap(data);

      const indices = data.map((id) => {
        const name = nameMap[id.toString()];

        if (name) {
          return createTextIndex(name);
        }
      });

      return combineTextIndexes(filterOutNullable(indices));
    },
    getScore: (query, target) => {
      return computeHybridScore(query, target.searchIndex);
    },
  },
  storageTransformer: {
    getDefaultData: () => [],
    toStorage: (data) => data.map((item) => new ObjectId(item)),
    fromStorage: async (data) => {
      const storageService = cms().service('base::storage');

      const infoMap = await storageService.getInfoMap(data);

      return data.map((id) => {
        const item = infoMap[id.toString()];

        if (item?.type !== StorageItemType.FILE) {
          throw new Error('Expected file');
        }

        return item;
      });
    },
  },
});
