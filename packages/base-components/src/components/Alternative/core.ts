import { defineComponentCore } from '@game-cms/core';

import { id } from './types.js';

export default defineComponentCore({
  id,
  defaultOutData: (options, context) => ({
    default: context.getDefaultData(options.componentId, options.baseOptions),
    alternative: [],
  }),
  pathWalker: (data, options, path, apply, context) => {
    const { baseOptions, componentId } = options;

    context.applyAtPath(componentId, data.default, baseOptions, path, apply);

    for (const item of data.alternative) {
      context.applyAtPath(componentId, item.value, baseOptions, path, apply);
    }
  },
});
