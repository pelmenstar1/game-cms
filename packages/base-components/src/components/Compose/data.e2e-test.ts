import { componentDataFlowTests } from '@game-cms/component-testing-lib/e2e';

import { number } from '../Number/index.js';
import { text } from '../Text/index.js';
import { compose } from './index.js';
import { id } from './types.js';

componentDataFlowTests(id, {
  outs: [
    {
      data: { name: 'Test', age: 25 },
      component: compose({
        name: text(),
        age: number(),
      }),
    },
  ],
});
