import { defineComponentCore } from '@game-cms/core';

import { dataShape } from './internal/schema.js';

export default defineComponentCore({
  id: 'base::graph',
  defaultRawData: () => ({
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
});
