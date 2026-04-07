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
  validator: (data, _, context) =>
    context.validate<ComposeId, ComposeArgs>(
      composeId,
      data,
      getComposeOptions()
    ),
  getDefaultData: (_, context) => {
    return context.getDefaultData<ComposeId, ComposeArgs>(
      composeId,
      getComposeOptions()
    );
  },
  transformer: {
    fromClient: (clientData, _, context) => {
      return context.fromClient<ComposeId, ComposeArgs>(
        composeId,
        clientData,
        getComposeOptions()
      );
    },
    toClient: (data, _, context) => {
      return context.toClient<ComposeId, ComposeArgs>(
        composeId,
        data,
        getComposeOptions()
      );
    },
  },
});
