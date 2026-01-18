import { componentDataFlowTests } from '@game-cms/component-testing-lib';

import { number } from './index.js';

componentDataFlowTests('base::number', {
  raws: [{ data: 123, component: number() }],
});
