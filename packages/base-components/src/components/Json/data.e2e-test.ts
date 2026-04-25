import { componentDataFlowTests } from '@game-cms/component-testing-lib/e2e';

import { json } from './index.js';
import { id } from './types.js';

componentDataFlowTests(id, {
  out: [
    { data: { abc: 1 }, component: json() },
    { data: {}, component: json() },
  ],
});
