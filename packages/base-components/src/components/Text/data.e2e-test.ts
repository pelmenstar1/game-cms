import { componentDataFlowTests } from '@game-cms/component-testing-lib';

import { text } from './index.js';

componentDataFlowTests('base::text', {
  outs: [{ data: '123', component: text() }],
});
