import { defineComponentClientController } from '@game-cms/core';

import core from './core.js';
import {
  type ComposeArgs,
  type ComposeId,
  composeOptions,
} from './internal/constants';

export default defineComponentClientController({
  core,
  meta: {
    ui: {
      compact: true,
    },
  },
  getDefaultData: () => ({
    images: [],
    atlas: [],
    skeleton: [],
  }),
  validator: (data, _, context, params) => {
    return context.validate<ComposeId, ComposeArgs>(
      'base::compose',
      data,
      composeOptions,
      params
    );
  },
  transformer: {
    fromClient: (clientData, _, context) => {
      return context.fromClient<ComposeId, ComposeArgs>(
        'base::compose',
        clientData,
        composeOptions
      );
    },
    toClient: (data, _, context) => {
      return context.toClient<ComposeId, ComposeArgs>(
        'base::compose',
        {
          images: data.images,
          skeleton: data.skeleton,
          atlas: data.originalAtlas ? [data.originalAtlas] : data.atlas,
        },
        composeOptions
      );
    },
  },
});
