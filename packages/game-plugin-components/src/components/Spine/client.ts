import type { ComponentClientDataTransformer } from '@game-cms/core';

import {
  ATLAS_OPTIONS,
  type ComposeArgs,
  type ComposeId,
  composeOptions,
  IMAGES_OPTIONS,
  SKELETON_OPTIONS,
} from './internal/constants';

export const clientTransformer: ComponentClientDataTransformer<'game::spine'> =
  {
    getDefaultData: () => ({
      images: [],
      atlas: [],
      skeleton: [],
    }),
    fromClient: (clientData, _, context) => {
      const images = context.fromClient(
        'base::file',
        clientData.images,
        IMAGES_OPTIONS
      );
      const atlas = context.fromClient(
        'base::file',
        clientData.atlas,
        ATLAS_OPTIONS
      );
      const skeleton = context.fromClient(
        'base::file',
        clientData.skeleton,
        SKELETON_OPTIONS
      );

      if (
        images.error !== undefined ||
        atlas.error !== undefined ||
        skeleton.error !== undefined
      ) {
        return {
          error: {
            images: images.error,
            atlas: atlas.error,
            skeleton: skeleton.error,
          },
        };
      }

      return {
        result: {
          images: images.result,
          atlas: atlas.result,
          skeleton: skeleton.result,
        },
      };
    },
    toClient: (data, _, context) => {
      return context.toClient<ComposeId, ComposeArgs>(
        'base::compose',
        data,
        composeOptions
      );
    },
  };
