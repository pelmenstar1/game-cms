import { componentMeta } from '@game-cms/core';

export default componentMeta({
  id: 'game::spine',
  config: {
    ui: {
      compact: true,
    },
  },
  defaultRawData: () => ({
    atlas: [],
    skeleton: [],
    images: [],
  }),
});
