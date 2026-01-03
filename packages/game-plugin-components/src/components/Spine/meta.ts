import { componentMeta } from '@game-cms/utils';

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
