import { defineComponentCore } from '@game-cms/core';

export default defineComponentCore({
  id: 'base::repeatable',
  defaultOutData: () => [],
  pathWalker: (data, options, path, apply, context) => {
    const { componentId, baseOptions } = options;

    for (const item of data) {
      context.applyAtPath(componentId, item, baseOptions, path, apply);
    }
  },
});
