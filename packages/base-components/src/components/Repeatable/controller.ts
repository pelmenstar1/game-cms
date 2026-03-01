import { defineComponentController, searchScoreComposer } from '@game-cms/core';

import core from './core.js';

export default defineComponentController({
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
      context.resolveOutData(componentId, item, baseOptions, args)
    );
  },
  search: {
    getScore: (query, target, options, context) => {
      const { storage, searchIndex } = target;
      const { componentId, baseOptions } = options;

      const composer = searchScoreComposer();

      for (let i = 0; i < storage.length; i++) {
        composer.include(
          context.getScore(
            query,
            componentId,
            {
              storage: storage[i],
              searchIndex: searchIndex[i],
            } as never,
            baseOptions
          )
        );
      }

      return composer.result();
    },
    createIndex: (data, options, context) => {
      const { componentId, baseOptions } = options;

      return data.map((item) =>
        context.createSearchIndex(componentId, item, baseOptions)
      );
    },
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
