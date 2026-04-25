import { componentDataFlowTests } from '@game-cms/component-testing-lib/e2e';
import { ObjectId } from 'mongodb';

import { entityReference } from './index.js';
import { id } from './types.js';

componentDataFlowTests(id, {
  out: [
    { data: null, component: entityReference({ entityId: 'test' }) },
    {
      data: new ObjectId().toString(),
      component: entityReference({ entityId: 'test' }),
    },
  ],
});
