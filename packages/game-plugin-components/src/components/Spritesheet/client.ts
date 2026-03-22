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
  validator: (data, options, context) =>
    context.validate<'base::compose', ComposeArgs>(
      'base::compose',
      data,
      getComposeOptions(options)
    ),
  getDefaultData: (options, context) => {
    return context.getDefaultData<'base::compose', ComposeArgs>(
      'base::compose',
      getComposeOptions(options)
    );
  },
  transformer: {
    fromClient: (clientData, options, context) => {
      return context.fromClient<'base::compose', ComposeArgs>(
        'base::compose',
        clientData,
        getComposeOptions(options)
      );
    },
    toClient: (data, options, context) => {
      return context.toClient<'base::compose', ComposeArgs>(
        'base::compose',
        {
          atlas: data.originalAtlas ? [data.originalAtlas] : data.atlas,
          texture: data.texture,
        },
        getComposeOptions(options)
      );
    },
  },
});
