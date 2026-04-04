import { componentDataFlowTests } from '@game-cms/component-testing-lib/e2e';

import { json } from './index.js';

componentDataFlowTests('base::json', {
  outs: [
    { data: { abc: 1 }, component: json() },
    { data: {}, component: json() },
  ],
});
