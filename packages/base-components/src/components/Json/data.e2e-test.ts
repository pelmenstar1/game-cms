import { componentDataFlowTests } from '@game-cms/component-testing-lib';

import { json } from './index.js';

componentDataFlowTests('base::json', {
  raws: [
    { data: { abc: 1 }, component: json() },
    { data: {}, component: json() },
  ],
});
