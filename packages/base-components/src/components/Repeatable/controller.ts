import { component } from '@game-cms/core';

import { defaultRawData, meta, validator } from './shared.js';

export default component({
  meta,
  validator,
  defaultRawData,
  resolver: (raw, options, context, args) => {
    const { baseOptions, componentId } = options;

    return raw.map((item) =>
      context.resolveRawData(componentId, item, baseOptions, args)
    );
  },
  pathWalker: (data, options, path, apply, context) => {
    const { componentId, baseOptions } = options;

    for (const item of data) {
      context.applyAtPath(componentId, item, baseOptions, path, apply);
    }
  },
  storageTransformer: {
    fromStorage: (data, options, context) => {
      const { componentId, baseOptions } = options;

      return Promise.all(
        data.map((item) => context.fromStorage(componentId, item, baseOptions))
      );
    },
    toStorage: (data, options, context) => {
      const { componentId, baseOptions } = options;

      return Promise.all(
        data.map((item) => context.toStorage(componentId, item, baseOptions))
      );
    },
  },
});
