import { componentDataFlowTests } from '@game-cms/component-testing-lib/e2e';

import { tileGrid } from './index.js';
import { id } from './types.js';

componentDataFlowTests(id, {
  out: [
    {
      data: [0, 0, 0, 0],
      component: tileGrid({ width: 2, height: 2 }),
    },
    {
      data: [1, 2, 3, 4, 5, 6],
      component: tileGrid({ width: 3, height: 2 }),
    },
  ],
});
