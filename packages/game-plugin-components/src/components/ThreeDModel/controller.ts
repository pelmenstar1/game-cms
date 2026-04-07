import { defineComponentController } from '@game-cms/core';

import { ComposeId, composeId } from '../../types/compose.js';
import core from './core.js';
import { ComposeArgs, getComposeOptions } from './internal/options.js';

export default defineComponentController({
  core,
  validator: (data, _, context) =>
    context.validate<ComposeId, ComposeArgs>(
      composeId,
      data,
      getComposeOptions()
    ),
  structure: (_, context) =>
    context.getStructure<ComposeId, ComposeArgs>(
      composeId,
      getComposeOptions()
    ),
  innerDependencies: (_, context) =>
    context.getDependencies<ComposeId, ComposeArgs>(
      composeId,
      getComposeOptions()
    ),
  atomWalker: (data, _, apply, context) => {
    context.walk(composeId, data, getComposeOptions(), apply);
  },
  mergeData: (target, source, _, context) =>
    context.merge<ComposeId, ComposeArgs>(
      composeId,
      target,
      source,
      getComposeOptions()
    ),
  migrate: (data, _, context) =>
    context.migrate<ComposeId, ComposeArgs>(
      composeId,
      data,
      getComposeOptions()
    ),
  search: {
    createIndex: (data, _, context) =>
      context.createSearchIndex<ComposeId, ComposeArgs>(
        composeId,
        data,
        getComposeOptions()
      ),
    getScore: (query, target, _, context) =>
      context.getScore<ComposeId, ComposeArgs>(
        query,
        composeId,
        target,
        getComposeOptions()
      ),
  },
  storageTransformer: {
    getDefaultData: (_, context) =>
      context.getDefaultData<ComposeId, ComposeArgs>(
        composeId,
        getComposeOptions()
      ),
    toStorage: (data, _, context) =>
      context.toStorage<ComposeId, ComposeArgs>(
        composeId,
        data,
        getComposeOptions()
      ),
    fromStorage: (data, _, context) =>
      context.fromStorage<ComposeId, ComposeArgs>(
        composeId,
        data,
        getComposeOptions()
      ),
  },
});
