import { componentDataFlowTests } from '@game-cms/component-testing-lib/e2e';
import { ObjectId } from 'mongodb';

import { entityReference } from './index.js';

componentDataFlowTests('base::entity-reference', {
  outs: [
    { data: null, component: entityReference({ entityId: 'test' }) },
    {
      data: new ObjectId().toString(),
      component: entityReference({ entityId: 'test' }),
    },
  ],
});
