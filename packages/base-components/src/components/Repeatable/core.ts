import { defineComponentCore } from '@game-cms/core';

import { id } from './internal/types.js';

export default defineComponentCore({
  id,
  defaultOutData: () => [],
  pathWalker: (data, options, path, apply, context) => {
    const { componentId, baseOptions } = options;

    for (const item of data) {
      context.applyAtPath(componentId, item, baseOptions, path, apply);
    }
  },
});
