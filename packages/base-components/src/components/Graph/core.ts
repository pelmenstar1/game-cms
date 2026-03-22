import { defineComponentCore } from '@game-cms/core';
import { isNonNullObject } from '@game-cms/shared';

export default defineComponentCore({
  id: 'base::graph',
  defaultOutData: () => ({
    nodes: {},
    edges: [],
  }),
  pathWalker: (data, options, path, apply, context) => {
    const { componentId, baseOptions } = options;
    const { nodes } = data;

    for (const key in nodes) {
      const nodeValue = nodes[key];

      if (isNonNullObject(nodeValue)) {
        const { value } = nodeValue;

        context.applyAtPath(componentId, value, baseOptions, path, apply);
      }
    }
  },
});
