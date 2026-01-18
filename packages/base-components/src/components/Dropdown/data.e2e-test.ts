import { componentDataFlowTests } from '@game-cms/component-testing-lib';

import { dropdown } from './index.js';

componentDataFlowTests('base::dropdown', {
  raws: [
    {
      data: 'option1',
      component: dropdown([
        { key: 'option1', title: 'Option 1' },
        { key: 'option2', title: 'Option 2' },
        { key: 'option3', title: 'Option 3' },
      ]),
    },
  ],
});
