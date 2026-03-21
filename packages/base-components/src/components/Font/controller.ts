import { defineComponentController } from '@game-cms/core';

import core from './core.js';
import { getRepeatableOptions, RepeatableArgs } from './internal/repeatable.js';

const id = 'base::repeatable';

type Id = typeof id;

export default defineComponentController({
  core,
  structure: (options, context) =>
    context.getStructure<Id, RepeatableArgs>(id, getRepeatableOptions(options)),
  migrate: (data, options, context) => {
    return context.migrate<Id, RepeatableArgs>(
      id,
      data,
      getRepeatableOptions(options)
    );
  },
  mergeData: (target, source, options, context) => {
    return context.merge<Id, RepeatableArgs>(
      id,
      target,
      source,
      getRepeatableOptions(options)
    );
  },
  storageTransformer: {
    getDefaultData: () => [],
    toStorage: (data, options, context) => {
      return context.toStorage<Id, RepeatableArgs>(
        id,
        data,
        getRepeatableOptions(options)
      );
    },
    fromStorage: async (data, options, context) => {
      return context.fromStorage<Id, RepeatableArgs>(
        id,
        data,
        getRepeatableOptions(options)
      );
    },
  },
  search: {
    createIndex: (data, options, context) => {
      return context.createSearchIndex<Id, RepeatableArgs>(
        id,
        data,
        getRepeatableOptions(options)
      );
    },
    getScore: (query, target, options, context) => {
      return context.getScore<Id, RepeatableArgs>(
        query,
        id,
        target as never,
        getRepeatableOptions(options)
      );
    },
  },
});
