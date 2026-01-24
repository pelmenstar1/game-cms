import { StorageFileItemWithMeta, StorageItemType } from '@game-cms/base-core';
import { componentDataFlowTests } from '@game-cms/component-testing-lib';
import { cms } from '@game-cms/global';
import { beforeAll, describe } from 'vitest';

import { file } from './index.js';

describe('File', () => {
  let realFile: StorageFileItemWithMeta;

  beforeAll(async () => {
    const name = '123.txt';
    const mime = 'text/plain';

    const file = await cms()
      .service('base::storage')
      .uploadFile({ name, mime, content: '123' });

    const meta = await cms().service('base::storage').getInfo(file.id);
    if (meta?.type !== StorageItemType.FILE) {
      throw new Error('Item should be file');
    }

    realFile = meta;
  });

  componentDataFlowTests('base::file', () => {
    return {
      raws: [
        { data: [], component: file() },
        { data: [realFile], component: file() },
      ],
    };
  });
});
