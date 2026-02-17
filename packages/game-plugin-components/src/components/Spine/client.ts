import type { ComponentClientDataTransformer } from '@game-cms/core';

import {
  type ComposeArgs,
  type ComposeId,
  composeOptions,
} from './internal/constants';

export const clientTransformer: ComponentClientDataTransformer<'game::spine'> =
  {
    getDefaultData: () => ({
      images: [],
      atlas: [],
      skeleton: [],
    }),
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
  };
