import { componentDataFlowTests } from '@game-cms/component-testing-lib/e2e';

import { text } from '../Text/index.js';
import { alternative } from './index.js';
import { id } from './types.js';

componentDataFlowTests(id, {
  outs: [
    {
      data: {
        default: '123',
        alternative: [
          { condition: { $type: 'var', name: 'abc' }, value: '321' },
        ],
      },
      component: alternative(text()),
    },
  ],
});
