import preview from '#storybook/preview';

import { SpineRenderer } from './SpineRenderer';

const meta = preview.meta({ component: SpineRenderer });

export const Primary: unknown = meta.story({
  args: {
    spine: {
      atlas: '/spineboy/spineboy.atlas',
      skeleton: '/spineboy/spineboy.json',
      images: ['/spineboy/spineboy.png'],
    },
    animation: 'run',
    style: {
      width: 700,
      height: 700,
    },
  },
});
