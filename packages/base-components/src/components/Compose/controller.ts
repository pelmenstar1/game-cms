import { defineComponentController } from '@game-cms/core';
import { isNonNullObject } from '@game-cms/shared';
import { asyncMapObject, mapObject } from '@game-cms/shared/object';

import { searchScoreComposer } from '../../internal/searchScoreComposer.js';
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
  search: (query, data, options, context) => {
    const composer = searchScoreComposer();

    for (const key in options) {
      const { componentId, options: baseOptions } = options[key];
      const value = data[key];

      composer.include(
        context.search(query, componentId, value as never, baseOptions)
      );
    }

    return composer.result();
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
