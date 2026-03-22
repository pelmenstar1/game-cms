import { defineComponentCore } from '@game-cms/core';

export default defineComponentCore({
  id: 'game::asset-wrapper',
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
