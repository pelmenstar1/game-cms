import preview from '#storybook/preview';

import { ImageView } from './ImageView';

const meta = preview.meta({ component: ImageView });

export const Primary = meta.story({
  args: {
    src: 'https://i.imgur.com/gbt7JG7.jpg',
    style: {
      width: '100%',
      height: '100%',
    },
  },
});
