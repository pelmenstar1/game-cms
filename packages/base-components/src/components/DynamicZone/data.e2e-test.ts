import { componentDataFlowTests } from '@game-cms/component-testing-lib';

import { compose } from '../Compose/index.js';
import { number } from '../Number/index.js';
import { text } from '../Text/index.js';
import { dynamicZone, dynamicZoneEntry } from './index.js';

componentDataFlowTests('base::dynamic-zone', {
  outs: [
    {
      data: [
        { key: 'item1', data: { abc: '123' } },
        { key: 'item2', data: { abc: 123 } },
      ],
      component: dynamicZone({
        options: {
          item1: dynamicZoneEntry({
            option: { title: 'Item 1' },
            component: compose({ abc: text() }),
          }),
          item2: dynamicZoneEntry({
            option: { title: 'Item 2' },
            component: compose({ abc: number() }),
          }),
        },
      }),
    },
  ],
});
