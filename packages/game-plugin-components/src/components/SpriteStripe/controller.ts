import { defineComponentController } from '@game-cms/core';

import { ComposeId, composeId } from '../../types/compose.js';
import core from './core.js';
import { ComposeArgs, getComposeOptions } from './internal/options.js';

export default defineComponentController({
  core,
  validator: (data, options, context) =>
    context.validate<ComposeId, ComposeArgs>(
      composeId,
      data,
      getComposeOptions(options)
    ),
  structure: (options, context) =>
    context.getStructure<ComposeId, ComposeArgs>(
      composeId,
      getComposeOptions(options)
    ),
  innerDependencies: (options, context) =>
    context.getDependencies<ComposeId, ComposeArgs>(
      composeId,
      getComposeOptions(options)
    ),
  mergeData: (target, source, options, context) =>
    context.merge<ComposeId, ComposeArgs>(
      composeId,
      target,
      source,
      getComposeOptions(options)
    ),
  migrate: (data, options, context) =>
    context.migrate<ComposeId, ComposeArgs>(
      composeId,
      data,
      getComposeOptions(options)
    ),
  resolver: (data, options, context, args) =>
    context.resolveOutData<ComposeId, ComposeArgs>(
      composeId,
      data,
      getComposeOptions(options),
      args
    ) as never,
  atomWalker: {
    applyEach: (data, options, apply, context) => {
      context.applyEach(composeId, data, getComposeOptions(options), apply);
    },
    filter: (data, options, predicate, context) =>
      context.filter<ComposeId, ComposeArgs>(
        composeId,
        data,
        getComposeOptions(options),
        predicate
      ),
  },
  outerLinkController: {
    contains: (outerLink, data, options, context) =>
      context.contains(outerLink, composeId, data, getComposeOptions(options)),
    delete: (outerLink, data, options, context) =>
      context.delete<ComposeId, ComposeArgs>(
        outerLink,
        composeId,
        data,
        getComposeOptions(options)
      ),
  },
  search: {
    createIndex: (data, options, context) =>
      context.createSearchIndex<ComposeId, ComposeArgs>(
        composeId,
        data,
        getComposeOptions(options)
      ),
    getScore: (query, target, options, context) =>
      context.getScore<ComposeId, ComposeArgs>(
        query,
        composeId,
        target,
        getComposeOptions(options)
      ),
  },
  storageTransformer: {
    getDefaultData: (options, context) =>
      context.getDefaultData<ComposeId, ComposeArgs>(
        composeId,
        getComposeOptions(options)
      ),
    toStorage: (data, options, context) =>
      context.toStorage<ComposeId, ComposeArgs>(
        composeId,
        data,
        getComposeOptions(options)
      ),
    fromStorage: (data, options, context) =>
      context.fromStorage<ComposeId, ComposeArgs>(
        composeId,
        data,
        getComposeOptions(options)
      ),
  },
});
