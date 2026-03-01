import { componentDataFlowTests } from '@game-cms/component-testing-lib';

import { text } from '../Text/index.js';
import { alternative } from './index.js';

componentDataFlowTests('base::alternative', {
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
