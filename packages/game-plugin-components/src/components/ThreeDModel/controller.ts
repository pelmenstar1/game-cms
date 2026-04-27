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
  resolver: (data, _, context, args) =>
    context.resolveOutData<ComposeId, ComposeArgs>(
      composeId,
      data,
      getComposeOptions(),
      args
    ) as never,
  atomWalker: {
    applyEach: (data, _, apply, context) => {
      context.applyEach(composeId, data, getComposeOptions(), apply);
    },
    filter: (data, _, predicate, context) =>
      context.filter<ComposeId, ComposeArgs>(
        composeId,
        data,
        getComposeOptions(),
        predicate
      ),
  },
  outerLinkController: {
    contains: (outerLink, data, _, context) =>
      context.contains(outerLink, composeId, data, getComposeOptions()),
    delete: (outerLink, data, _, context) =>
      context.delete<ComposeId, ComposeArgs>(
        outerLink,
        composeId,
        data,
        getComposeOptions()
      ),
  },
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
