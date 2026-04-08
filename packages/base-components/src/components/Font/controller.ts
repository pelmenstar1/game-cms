import { defineComponentController } from '@game-cms/core';

import core from './core.js';
import {
  getRepeatableOptions,
  RepeatableArgs,
  RepeatableId,
} from './internal/repeatable.js';

export default defineComponentController({
  core,
  validator: (data, options, context) => {
    return context.validate<RepeatableId, RepeatableArgs>(
      'base::repeatable',
      data,
      getRepeatableOptions(options)
    );
  },
  structure: (options, context) =>
    context.getStructure<RepeatableId, RepeatableArgs>(
      'base::repeatable',
      getRepeatableOptions(options)
    ),
  migrate: (data, options, context) => {
    return context.migrate<RepeatableId, RepeatableArgs>(
      'base::repeatable',
      data,
      getRepeatableOptions(options)
    );
  },
  mergeData: (target, source, options, context) => {
    return context.merge<RepeatableId, RepeatableArgs>(
      'base::repeatable',
      target,
      source,
      getRepeatableOptions(options)
    );
  },
  storageTransformer: {
    getDefaultData: () => [],
    toStorage: (data, options, context) => {
      return context.toStorage<RepeatableId, RepeatableArgs>(
        'base::repeatable',
        data,
        getRepeatableOptions(options)
      );
    },
    fromStorage: (data, options, context) => {
      return context.fromStorage<RepeatableId, RepeatableArgs>(
        'base::repeatable',
        data,
        getRepeatableOptions(options)
      );
    },
  },
  search: {
    createIndex: (data, options, context) => {
      return context.createSearchIndex<RepeatableId, RepeatableArgs>(
        'base::repeatable',
        data,
        getRepeatableOptions(options)
      );
    },
    getScore: (query, target, options, context) => {
      return context.getScore<RepeatableId, RepeatableArgs>(
        query,
        'base::repeatable',
        target as never,
        getRepeatableOptions(options)
      );
    },
  },
});
