import { componentCore } from '@game-cms/core';
import { isNonNullObject } from '@game-cms/shared';

import {
  ATLAS_OPTIONS,
  IMAGES_OPTIONS,
  SKELETON_OPTIONS,
} from './constants.js';

export default componentCore({
  id: 'game::spine',
  meta: {
    ui: {
      compact: true,
    },
  },
  defaultRawData: () => ({
    atlas: [],
    skeleton: [],
    images: [],
  }),
  validator: (data, _, context) => {
    if (
      !(
        isNonNullObject(data) &&
        'atlas' in data &&
        'images' in data &&
        'skeleton' in data
      )
    ) {
      return { ownError: 'INVALID_TYPE' as const };
    }

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
  },
});
