import { component } from '@game-cms/core';

import {
  ATLAS_OPTIONS,
  IMAGES_OPTIONS,
  SKELETON_OPTIONS,
} from './constants.js';
import { defaultRawData, meta, validator } from './shared.js';

export default component({
  meta,
  validator,
  defaultRawData,
  storageTransformer: {
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
