import {
  componentController,
  type ComponentStorageDataById,
} from '@game-cms/core';

import {
  ATLAS_OPTIONS,
  IMAGES_OPTIONS,
  SKELETON_OPTIONS,
} from './constants.js';
import core from './core.js';

export default componentController({
  core,
  structure: (_, context) => ({
    atlas: context.getStructure('base::file', ATLAS_OPTIONS),
    images: context.getStructure('base::file', IMAGES_OPTIONS),
    skeleton: context.getStructure('base::file', SKELETON_OPTIONS),
  }),
  migrate: (data, _, context) => {
    return context.migrate('base::compose', data, {
      atlas: { componentId: 'base::file', options: ATLAS_OPTIONS },
      images: { componentId: 'base::file', options: IMAGES_OPTIONS },
      skeleton: { componentId: 'base::file', options: SKELETON_OPTIONS },
    }) as ComponentStorageDataById<'game::spine'>;
  },
  storageTransformer: {
    getDefaultData: () => ({
      atlas: [],
      images: [],
      skeleton: [],
    }),
    toStorage: async (data, _, context) => {
      const [atlas, images, skeleton] = await Promise.all(
        [
          { value: data.atlas, options: ATLAS_OPTIONS },
          { value: data.images, options: IMAGES_OPTIONS },
          { value: data.skeleton, options: SKELETON_OPTIONS },
        ].map(({ value, options }) =>
          context.toStorage('base::file', value, options)
        )
      );

      return { atlas, images, skeleton };
    },
    fromStorage: async (data, _, context) => {
      const [atlas, images, skeleton] = await Promise.all(
        [
          { value: data.atlas, options: ATLAS_OPTIONS },
          { value: data.images, options: IMAGES_OPTIONS },
          { value: data.skeleton, options: SKELETON_OPTIONS },
        ].map(({ value, options }) =>
          context.fromStorage('base::file', value, options)
        )
      );

      return { atlas, images, skeleton };
    },
  },
});
