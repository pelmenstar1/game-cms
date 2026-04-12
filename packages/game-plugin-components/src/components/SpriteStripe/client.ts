import { defineComponentClientController } from '@game-cms/core';

import { ComposeId, composeId } from '../../types/compose.js';
import core from './core.js';
import { ComposeArgs, getComposeOptions } from './internal/options.js';

export default defineComponentClientController({
  core,
  meta: {
    ui: {
      compact: true,
    },
  },
  validator: (data, options, context) =>
    context.validate<ComposeId, ComposeArgs>(
      composeId,
      data,
      getComposeOptions(options)
    ),
  getDefaultData: (options, context) => {
    return context.getDefaultData<ComposeId, ComposeArgs>(
      composeId,
      getComposeOptions(options)
    );
  },
  transformer: {
    fromClient: (clientData, options, context) => {
      return context.fromClient<ComposeId, ComposeArgs>(
        composeId,
        clientData,
        getComposeOptions(options)
      );
    },
    toClient: (data, options, context) => {
      return context.toClient<ComposeId, ComposeArgs>(
        composeId,
        data,
        getComposeOptions(options)
      );
    },
  },
});
