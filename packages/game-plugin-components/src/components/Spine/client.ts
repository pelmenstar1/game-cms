import { defineComponentClientController } from '@game-cms/core';

import { ComposeId, composeId } from '../../types/compose.js';
import core from './core.js';
import { type ComposeArgs, composeOptions } from './internal/constants.js';

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
      composeId,
      data,
      composeOptions,
      params
    );
  },
  transformer: {
    fromClient: (clientData, _, context) => {
      return context.fromClient<ComposeId, ComposeArgs>(
        composeId,
        clientData,
        composeOptions
      );
    },
    toClient: (data, _, context) => {
      return context.toClient<ComposeId, ComposeArgs>(
        composeId,
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
