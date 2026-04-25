import { StorageFileItemWithId, StorageItemType } from '@game-cms/base-core';
import { componentDataFlowTests } from '@game-cms/component-testing-lib/e2e';
import { beforeAll, describe } from '@game-cms/e2e';
import { cms } from '@game-cms/global';

import { spriteStripe } from './index.js';
import { id } from './types.js';

describe('SpriteStripe', () => {
  let imageFile: StorageFileItemWithId;

  beforeAll(async () => {
    const uploaded = await cms()
      .service('base::storage')
      .uploadFile({
        name: 'test.png',
        mime: 'image/png',
        content: Buffer.from('fake-image-data'),
      });

    const meta = await cms().service('base::storage').getInfo(uploaded.id);
    if (meta?.type !== StorageItemType.FILE) {
      throw new Error('Item should be file');
    }

    imageFile = meta;
  });

  componentDataFlowTests(id, () => ({
    out: [
      {
        data: { image: [imageFile], width: 100, height: 50 },
        component: spriteStripe(),
      },
    ],
  }));
});
