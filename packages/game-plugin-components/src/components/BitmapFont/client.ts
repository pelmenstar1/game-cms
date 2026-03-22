import { defineComponentClientController } from '@game-cms/core';

import core from './core.js';
import { ComposeArgs, getComposeOptions } from './internal/options.js';

export default defineComponentClientController({
  core,
  meta: {
    ui: {
      compact: true,
    },
  },
  getDefaultData: (_, context) => {
    return context.getDefaultData<'base::compose', ComposeArgs>(
      'base::compose',
      getComposeOptions()
    );
  },
  validator: (data, _, context) =>
    context.validate<'base::compose', ComposeArgs>(
      'base::compose',
      data,
      getComposeOptions()
    ),
  transformer: {
    fromClient: (clientData, _, context) => {
      return context.fromClient<'base::compose', ComposeArgs>(
        'base::compose',
        clientData,
        getComposeOptions()
      );
    },
    toClient: (data, _, context) => {
      return context.toClient<'base::compose', ComposeArgs>(
        'base::compose',
        {
          atlas: data.originalAtlas ? [data.originalAtlas] : data.atlas,
          pages: data.pages,
        },
        getComposeOptions()
      );
    },
  },
});
