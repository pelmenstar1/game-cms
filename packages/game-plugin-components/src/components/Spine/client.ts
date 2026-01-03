import type { ComponentClientDataResolver } from '@game-cms/core';

import { ATLAS_OPTIONS, IMAGES_OPTIONS, SKELETON_OPTIONS } from './constants';

export const clientResolver: ComponentClientDataResolver<'game::spine'> = {
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
      IMAGES_OPTIONS
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
  toClient: async (data, _, context) => {
    const [images, atlas, skeleton] = await Promise.all([
      context.toClient('base::file', data.images, IMAGES_OPTIONS),
      context.toClient('base::file', data.atlas, ATLAS_OPTIONS),
      context.toClient('base::file', data.skeleton, SKELETON_OPTIONS),
    ]);

    return { images, atlas, skeleton };
  },
};
