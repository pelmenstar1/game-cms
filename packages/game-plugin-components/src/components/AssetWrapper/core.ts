import { defineComponentCore } from '@game-cms/core';

import { id } from './types.js';

export default defineComponentCore({
  id,
  defaultOutData: (options, context) => {
    return {
      base: context.getDefaultData(options.componentId, options.baseOptions),
    };
  },
  pathWalker: (data, options, path, apply, context) => {
    context.applyAtPath(
      options.componentId,
      data,
      options.baseOptions,
      path,
      apply
    );
  },
});
