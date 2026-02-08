import { ComponentClientDataTransformer } from '@game-cms/core';

import { ComposeArgs, getComposeOptions } from './internal/options.js';

export const clientTransformer: ComponentClientDataTransformer<'game::three-d-model'> =
  {
    ownValidation: true,
    getDefaultData: (_, context) => {
      return context.getDefaultData<'base::compose', ComposeArgs>(
        'base::compose',
        getComposeOptions()
      );
    },
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
        data,
        getComposeOptions()
      );
    },
  };
