import { defineComponentController } from '@game-cms/core';

import { searchScoreComposer } from '../../internal/searchScoreComposer.js';
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
      context.resolveRawData(componentId, item, baseOptions, args)
    );
  },
  search: (query, data, options, context) => {
    const { baseOptions, componentId } = options;

    const composer = searchScoreComposer();

    for (const item of data) {
      composer.include(context.search(query, componentId, item, baseOptions));
    }

    return composer.result();
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
