import { defineComponentCore } from '@game-cms/core';

export default defineComponentCore({
  id: 'game::spine',
  defaultOutData: () => ({
    atlas: [],
    skeleton: [],
    images: [],
  }),
});
