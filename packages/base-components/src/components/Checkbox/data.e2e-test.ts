import { componentDataFlowTests } from '@game-cms/component-testing-lib/e2e';

import { checkbox } from './index.js';
import { id } from './types.js';

componentDataFlowTests(id, {
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
