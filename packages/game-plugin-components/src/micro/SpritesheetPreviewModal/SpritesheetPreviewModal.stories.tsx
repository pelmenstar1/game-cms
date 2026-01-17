import preview from '#storybook/preview';

import { SpritesheetPreviewModal } from './SpritesheetPreviewModal';

const meta = preview.meta({ component: SpritesheetPreviewModal });

export const Primary: unknown = meta.story({
  args: {
    entryMap: {
      a: {
        imageUrl: 'https://i.imgur.com/gbt7JG7.jpg',
        atlasUrl: '/spineboy/spineboy.json',
      },
      b: {
        imageUrl: 'https://i.imgur.com/gbt7JG7.jpg',
        atlasUrl: '/spineboy/spineboy.json',
      },
    },
    onClose: () => {},
  },
});
