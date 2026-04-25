import { StorageFileItemWithId, StorageItemType } from '@game-cms/base-core';
import { componentDataFlowTests } from '@game-cms/component-testing-lib/e2e';
import { beforeAll, describe } from '@game-cms/e2e';
import { cms } from '@game-cms/global';

import { font } from './index.js';
import type { FontStyle } from './types.js';
import { id } from './types.js';

describe('Font', () => {
  let realFile: StorageFileItemWithId;

  beforeAll(async () => {
    const name = 'test.woff2';
    const mime = 'font/woff2';

    const file = await cms()
      .service('base::storage')
      .uploadFile({ name, mime, content: Buffer.from('fake-font-data') });

    const meta = await cms().service('base::storage').getInfo(file.id);
    if (meta?.type !== StorageItemType.FILE) {
      throw new Error('Item should be file');
    }

    realFile = meta;
  });

  componentDataFlowTests(id, () => {
    const style: FontStyle = 'normal';

    return {
      out: [
        { data: [], component: font() },
        {
          data: [{ file: [realFile], weight: 400, style }],
          component: font(),
        },
      ],
    };
  });
});
