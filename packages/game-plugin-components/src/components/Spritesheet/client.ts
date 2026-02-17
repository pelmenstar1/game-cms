import { ComponentClientDataTransformer } from '@game-cms/core';

import { ComposeArgs, getComposeOptions } from './internal/options.js';

export const clientTransformer: ComponentClientDataTransformer<'game::spritesheet'> =
  {
    ownValidation: true,
    getDefaultData: (options, context) => {
      return context.getDefaultData<'base::compose', ComposeArgs>(
        'base::compose',
        getComposeOptions(options)
      );
    },
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
  };
