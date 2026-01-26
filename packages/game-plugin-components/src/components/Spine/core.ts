import { componentCore } from '@game-cms/core';

import { composeOptions } from './internal/constants.js';

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
  validator: (data, _, context, params) => {
    return context.validate('base::compose', data, composeOptions, params);
  },
});
