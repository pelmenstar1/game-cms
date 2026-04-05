import { componentDataFlowTests } from '@game-cms/component-testing-lib/e2e';

import { number } from './index.js';
import { id } from './types.js';

componentDataFlowTests(id, {
  outs: [{ data: 123, component: number() }],
});
