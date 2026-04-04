import { StorageFileItemWithId, StorageItemType } from '@game-cms/base-core';
import { componentDataFlowTests } from '@game-cms/component-testing-lib/e2e';
import { beforeAll, describe } from '@game-cms/e2e';
import { cms } from '@game-cms/global';

import { file } from './index.js';

describe('File', () => {
  let realFile: StorageFileItemWithId;

  beforeAll(async () => {
    const name = '123.txt';
    const mime = 'text/plain';

    const file = await cms()
      .service('base::storage')
      .uploadFile({ name, mime, content: Buffer.from('123') });

    const meta = await cms().service('base::storage').getInfo(file.id);
    if (meta?.type !== StorageItemType.FILE) {
      throw new Error('Item should be file');
    }

    realFile = meta;
  });

  componentDataFlowTests('base::file', () => {
    return {
      outs: [
        { data: [], component: file() },
        { data: [realFile], component: file() },
      ],
    };
  });
});
