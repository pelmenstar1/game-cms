import { componentDataFlowTests } from '@game-cms/component-testing-lib';

import { number } from '../Number/index.js';
import { text } from '../Text/index.js';
import { compose } from './index.js';

componentDataFlowTests('base::compose', {
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
