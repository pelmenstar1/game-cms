import { component } from '@game-cms/core';

import { defaultRawData, meta, validator } from './shared.js';

export default component({
  meta,
  defaultRawData,
  validator,
  resolver: (data, options, context, args) => {
    const { componentId, baseOptions } = options;

    return context.resolveRawData(componentId, data, baseOptions, args);
  },
  storageTransformer: {
    fromStorage: (data, options, context) => {
      const { componentId, baseOptions } = options;

      return context.fromStorage(componentId, data.base, baseOptions);
    },
    toStorage: async (data, options, context) => {
      const { componentId, baseOptions } = options;

      return {
        base: await context.toStorage(componentId, data as never, baseOptions),
      };
    },
  },
});
