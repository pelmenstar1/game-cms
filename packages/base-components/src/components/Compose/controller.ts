import { defineComponentController } from '@game-cms/core';
import { isNonNullObject } from '@game-cms/shared';
import { asyncMapObject, mapObject } from '@game-cms/shared/object';

import core from './core.js';

export default defineComponentController({
  core,
  structure: (options, context) => {
    return mapObject(options, (prop) =>
      context.getStructure(prop.componentId, prop.options)
    );
  },
  migrate: (data, options, context) => {
    if (isNonNullObject(data)) {
      return mapObject(options, ({ componentId, options }, key) =>
        context.migrate(componentId, data[key], options)
      );
    }
  },
  resolver: (raw, options, context, args) => {
    return mapObject(raw, (value, key) => {
      const { componentId, options: baseOptions } = options[key];

      return context.resolveRawData(componentId, value, baseOptions, args);
    });
  },
  pathWalker: (data, options, path, apply, context) => {
    const dotIndex = path.indexOf('.');

    if (dotIndex !== -1) {
      const prefix = path.slice(0, dotIndex);
      const suffix = path.slice(dotIndex + 1);

      const value = data[prefix];
      const { componentId, options: baseOptions } = options[prefix];

      context.applyAtPath(componentId, value, baseOptions, suffix, apply);
    } else {
      apply(data[path]);
    }
  },
  mergeData: async (target, source, options, context) => {
    const sourceMerged = await asyncMapObject(source, (item, key) => {
      const { componentId, options: baseOptions } = options[key];

      return context.merge(
        componentId,
        target[key] as never,
        item as never,
        baseOptions
      );
    });

    return { ...target, ...sourceMerged };
  },
  storageTransformer: {
    getDefaultData: (options, context) => {
      return mapObject(options, (item) =>
        context.getDefaultData(item.componentId, item.options)
      );
    },
    fromStorage: (data, options, context) => {
      return asyncMapObject(data, (item, key) => {
        const { componentId, options: baseOptions } = options[key];

        return context.fromStorage(componentId, item as never, baseOptions);
      });
    },
    toStorage: (data, options, context) => {
      return asyncMapObject(data, (item, key) => {
        const { componentId, options: baseOptions } = options[key];

        return context.toStorage(componentId, item as never, baseOptions);
      });
    },
  },
});
