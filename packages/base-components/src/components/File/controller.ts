import { StorageItemType } from '@game-cms/base-types';
import { component } from '@game-cms/core';
import { cms } from '@game-cms/global';
import { ObjectId } from 'mongodb';

import { defaultRawData, meta, validator } from './shared.js';
import { FileRawDataItem } from './types.js';

export default component({
  meta,
  validator,
  defaultRawData,
  storageTransformer: {
    toStorage: (data) => data.map((item) => new ObjectId(item)),
    fromStorage: async (data) => {
      const infoList = await cms().service('base::storage').getInfoList(data);

      return infoList.map((item): FileRawDataItem => {
        if (item.type !== StorageItemType.FILE) {
          throw new Error('Expected file');
        }

        const { id, name, mime, url } = item;

        return { id, name, mime, url };
      });
    },
  },
});
