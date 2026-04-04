import { componentDataFlowTests } from '@game-cms/component-testing-lib/e2e';

import { checkbox } from './index.js';

componentDataFlowTests('base::checkbox', {
  outs: [
    {
      data: ['choice1', 'choice3'],
      component: checkbox({
        choice1: { title: 'Choice 1' },
        choice2: { title: 'Choice 2' },
        choice3: { title: 'Choice 3' },
      }),
    },
  ],
});
