import type { ComponentDataValidator } from '@game-cms/types';

import { ATLAS_OPTIONS, IMAGES_OPTIONS, SKELETON_OPTIONS } from './shared.js';

export const validator: ComponentDataValidator<'game::spine'> = (
  data,
  _,
  context
) => {
  return {
    atlas: context.validate('base::file', data.atlas, ATLAS_OPTIONS),
    images: context.validate('base::file', data.images, IMAGES_OPTIONS),
    skeleton: context.validate('base::file', data.skeleton, SKELETON_OPTIONS),
  };
};
