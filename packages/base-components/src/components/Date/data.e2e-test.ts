import { componentDataFlowTests } from '@game-cms/component-testing-lib';

import { date } from './index.js';

componentDataFlowTests('base::date', {
  outs: [
    {
      data: '2024-01-15T00:00:00.000Z',
      component: date(),
    },
  ],
});
