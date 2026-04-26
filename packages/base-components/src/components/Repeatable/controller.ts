import { defineComponentController, searchScoreComposer } from '@game-cms/core';

import core from './core.js';
import { validator } from './validator.js';

export default defineComponentController({
  core,
  validator: (data, options, context) => {
    const { componentId, baseOptions } = options;

    return validator(data, {
      validateItem: (element) =>
        context.validate(componentId, element, baseOptions),
    });
  },
  structure: (options, context) =>
    context.getStructure(options.componentId, options.baseOptions),
  innerDependencies: (options, context) =>
    context.getDependencies(options.componentId, options.baseOptions),
  atomWalker: {
    applyEach: (data, options, apply, context) => {
      const { componentId, baseOptions } = options;

      for (const item of data) {
        context.applyEach(componentId, item, baseOptions, apply);
      }
    },
    filter: (data, options, predicate, context) => {
      const { componentId, baseOptions } = options;

      return data
        .filter((item) => predicate(componentId, item, baseOptions))
        .map((item) =>
          context.filter(componentId, item, baseOptions, predicate)
        );
    },
  },
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

      return Promise.all(
        data.map((item) =>
          context.createSearchIndex(componentId, item, baseOptions)
        )
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
    disposeData: async (data, options, context) => {
      const { componentId, baseOptions } = options;

      await Promise.all(
        data.map((item) => context.disposeData(componentId, item, baseOptions))
      );
    },
  },
  clientOptionsTransformer: {
    toClient: (options, context) => {
      const { componentId, baseOptions } = options;

      return {
        componentId,
        title: options.title,
        baseOptions: context.toClient(componentId, baseOptions),
      };
    },
  },
});
