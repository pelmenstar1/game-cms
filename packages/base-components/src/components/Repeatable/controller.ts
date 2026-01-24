import { componentController } from '@game-cms/core';

import core from './core.js';

export default componentController({
  core,
  structure: (options, context) =>
    context.getStructure(options.componentId, options.baseOptions),
  migrate: (data, options, context) => {
    if (Array.isArray(data)) {
      const { componentId, baseOptions } = options;

      return data.map((item) =>
        context.migrate(componentId, item, baseOptions)
      );
    }
  },
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
    getDefaultData: () => [],
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
