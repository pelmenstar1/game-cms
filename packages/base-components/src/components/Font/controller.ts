import { defineComponentController } from '@game-cms/core';

import core from './core.js';
import { getRepeatableOptions, RepeatableArgs } from './internal/repeatable.js';

export default defineComponentController({
  core,
  structure: (options, context) =>
    context.getStructure('base::repeatable', getRepeatableOptions(options)),
  migrate: (data, options, context) => {
    return context.migrate<'base::repeatable', RepeatableArgs>(
      'base::repeatable',
      data,
      getRepeatableOptions(options)
    );
  },
  mergeData: (target, source, options, context) => {
    return context.merge<'base::repeatable', RepeatableArgs>(
      'base::repeatable',
      target,
      source,
      getRepeatableOptions(options)
    );
  },
  storageTransformer: {
    getDefaultData: () => [],
    toStorage: (data, options, context) => {
      return context.toStorage<'base::repeatable', RepeatableArgs>(
        'base::repeatable',
        data,
        getRepeatableOptions(options)
      );
    },
    fromStorage: async (data, options, context) => {
      return context.fromStorage<'base::repeatable', RepeatableArgs>(
        'base::repeatable',
        data,
        getRepeatableOptions(options)
      );
    },
  },
  search: {
    createIndex: (data, options, context) => {
      return context.createSearchIndex<'base::repeatable', RepeatableArgs>(
        'base::repeatable',
        data,
        getRepeatableOptions(options)
      );
    },
    getScore: (index, query, options, context) => {
      return context.getScore(
        'base::repeatable',
        index,
        query,
        getRepeatableOptions(options)
      );
    },
  },
});
