import { componentDataFlowTests } from '@game-cms/component-testing-lib/e2e';

import { number } from '../Number/index.js';
import { text } from '../Text/index.js';
import { graph } from './index.js';
import { id } from './types.js';

componentDataFlowTests(id, {
  outs: [
    {
      data: { nodes: {}, edges: [] },
      component: graph({ component: text() }),
    },
    {
      data: {
        nodes: {
          node1: { value: '123', meta: { position: { x: 0, y: 0 } } },
          node2: { value: '321', meta: { position: { x: 100, y: 100 } } },
        },
        edges: [{ source: 'node1', target: 'node2' }],
      },
      component: graph({ component: text() }),
    },
    {
      data: {
        nodes: {
          node1: { value: 42, meta: { position: { x: 0, y: 0 } } },
        },
        edges: [],
      },
      component: graph({ component: number() }),
    },
  ],
});
