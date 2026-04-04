import { componentDataFlowTests } from '@game-cms/component-testing-lib/e2e';

import { number } from './index.js';

componentDataFlowTests('base::number', {
  outs: [{ data: 123, component: number() }],
});
