import { defineComponentController } from '@game-cms/core';

import core from './core.js';
import { ComposeArgs, getComposeOptions } from './internal/options.js';

export default defineComponentController({
  core,
  structure: (_, context) =>
    context.getStructure<'base::compose', ComposeArgs>(
      'base::compose',
      getComposeOptions()
    ),
  atomWalker: (data, _, apply, context) => {
    context.walk('base::compose', data, getComposeOptions(), apply);
  },
  mergeData: (target, source, _, context) =>
    context.merge<'base::compose', ComposeArgs>(
      'base::compose',
      target,
      source,
      getComposeOptions()
    ),
  migrate: (data, _, context) =>
    context.migrate<'base::compose', ComposeArgs>(
      'base::compose',
      data,
      getComposeOptions()
    ),
  search: {
    createIndex: (data, _, context) =>
      context.createSearchIndex<'base::compose', ComposeArgs>(
        'base::compose',
        data,
        getComposeOptions()
      ),
    getScore: (query, target, _, context) =>
      context.getScore<'base::compose', ComposeArgs>(
        query,
        'base::compose',
        target,
        getComposeOptions()
      ),
  },
  storageTransformer: {
    getDefaultData: (_, context) =>
      context.getDefaultData<'base::compose', ComposeArgs>(
        'base::compose',
        getComposeOptions()
      ),
    toStorage: (data, _, context) =>
      context.toStorage<'base::compose', ComposeArgs>(
        'base::compose',
        data,
        getComposeOptions()
      ),
    fromStorage: (data, _, context) =>
      context.fromStorage<'base::compose', ComposeArgs>(
        'base::compose',
        data,
        getComposeOptions()
      ),
  },
});
