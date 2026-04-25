import { text } from '@game-cms/base-components';
import { componentDataFlowTests } from '@game-cms/component-testing-lib/e2e';

import { assetWrapper } from './index.js';
import { id } from './types.js';

componentDataFlowTests(id, {
  out: [
    {
      data: { base: '', derived: {} },
      component: assetWrapper({ pipeline: [], component: text() }),
    },
    {
      data: { base: 'hello', derived: {} },
      component: assetWrapper({ pipeline: [], component: text() }),
    },
  ],
});
