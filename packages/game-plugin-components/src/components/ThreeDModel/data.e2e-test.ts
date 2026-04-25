import { StorageFileItemWithId, StorageItemType } from '@game-cms/base-core';
import { componentDataFlowTests } from '@game-cms/component-testing-lib/e2e';
import { beforeAll, describe } from '@game-cms/e2e';
import { cms } from '@game-cms/global';

import { threeDModel } from './index.js';
import { id } from './types.js';

describe('ThreeDModel', () => {
  let modelFile: StorageFileItemWithId;

  beforeAll(async () => {
    const uploaded = await cms()
      .service('base::storage')
      .uploadFile({
        name: 'test.glb',
        mime: 'model/gltf-binary',
        content: Buffer.from('fake-model-data'),
      });

    const meta = await cms().service('base::storage').getInfo(uploaded.id);
    if (meta?.type !== StorageItemType.FILE) {
      throw new Error('Item should be file');
    }

    modelFile = meta;
  });

  componentDataFlowTests(id, () => ({
    out: [
      {
        data: { file: [] },
        component: threeDModel(),
      },
      {
        data: { file: [modelFile] },
        component: threeDModel(),
      },
    ],
  }));
});
