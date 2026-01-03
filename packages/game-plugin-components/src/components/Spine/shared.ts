import {
  type ComponentDataValidator,
  type ComponentDefaultDataHandler,
  componentMeta,
} from '@game-cms/core';

import {
  ATLAS_OPTIONS,
  IMAGES_OPTIONS,
  SKELETON_OPTIONS,
} from './constants.js';

const id = 'game::spine';

type Id = typeof id;

export const meta = componentMeta({
  id,
  config: {
    ui: {
      compact: true,
    },
  },
});

export const defaultRawData: ComponentDefaultDataHandler<Id> = () => ({
  atlas: [],
  skeleton: [],
  images: [],
});

export const validator: ComponentDataValidator<Id> = (data, _, context) => {
  const result = {
    atlas: context.validate('base::file', data.atlas, ATLAS_OPTIONS),
    images: context.validate('base::file', data.images, IMAGES_OPTIONS),
    skeleton: context.validate('base::file', data.skeleton, SKELETON_OPTIONS),
  };

  if (
    result.atlas !== undefined ||
    result.images !== undefined ||
    result.skeleton !== undefined
  ) {
    return result;
  }
};
