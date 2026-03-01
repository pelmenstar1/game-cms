import { defineComponentCore } from '@game-cms/core';
import { isNonNullObject } from '@game-cms/shared';

import { dataShape } from './internal/schema.js';

export default defineComponentCore({
  id: 'base::graph',
  defaultOutData: () => ({
    nodes: {},
    edges: [],
  }),
  validator: (rawData, options, context) => {
    const parseResult = dataShape.safeParse(rawData);
    if (!parseResult.success) {
      return { ownError: 'INVALID_TYPE' as const };
    }

    const { data } = parseResult;
    const { componentId, baseOptions } = options;

    const errors = Object.entries(data.nodes).map(
      ([key, { value }]) =>
        [key, context.validate(componentId, value, baseOptions)] as const
    );

    if (errors.some(([, value]) => value !== undefined)) {
      return {
        base: Object.fromEntries(errors),
      };
    }
  },
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
