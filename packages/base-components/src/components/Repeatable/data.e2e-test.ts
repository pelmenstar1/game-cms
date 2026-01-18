import { componentDataFlowTests } from '@game-cms/component-testing-lib';

import { compose } from '../Compose/index.js';
import { number } from '../Number/index.js';
import { text } from '../Text/index.js';
import { repeatable } from './index.js';

componentDataFlowTests('base::repeatable', {
  raws: [
    {
      data: ['123', '321'],
      component: repeatable({ component: text() }),
    },
    {
      data: [{ abc: 123 }, { abc: 321 }],
      component: repeatable({ component: compose({ abc: number() }) }),
    },
  ],
});
