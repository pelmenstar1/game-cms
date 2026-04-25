import { componentDataFlowTests } from '@game-cms/component-testing-lib/e2e';

import { date } from './index.js';
import { id } from './types.js';

componentDataFlowTests(id, {
  out: [
    {
      data: '2024-01-15T00:00:00.000Z',
      component: date(),
    },
  ],
});
