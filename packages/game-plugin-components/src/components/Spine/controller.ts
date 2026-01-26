import { componentController } from '@game-cms/core';

import core from './core.js';
import {
  type ComposeArgs,
  type ComposeId,
  composeOptions,
} from './internal/constants.js';

export default componentController({
  core,
  structure: (_, context) =>
    context.getStructure<ComposeId, ComposeArgs>(
      'base::compose',
      composeOptions
    ),
  migrate: (data, _, context) => {
    return context.migrate<ComposeId, ComposeArgs>(
      'base::compose',
      data,
      composeOptions
    );
  },
  mergeData: (target, source, _, context) => {
    return context.merge<ComposeId, ComposeArgs>(
      'base::compose',
      target,
      source,
      composeOptions
    );
  },
  storageTransformer: {
    getDefaultData: () => ({
      atlas: [],
      images: [],
      skeleton: [],
    }),
    toStorage: (data, _, context) => {
      return context.toStorage<ComposeId, ComposeArgs>(
        'base::compose',
        data,
        composeOptions
      );
    },
    fromStorage: async (data, _, context) => {
      return context.fromStorage<ComposeId, ComposeArgs>(
        'base::compose',
        data,
        composeOptions
      );
    },
  },
});
