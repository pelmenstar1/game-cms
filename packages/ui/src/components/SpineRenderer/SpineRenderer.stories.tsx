import preview from '#storybook/preview';

import { SpineRenderer } from './SpineRenderer';

const meta = preview.meta({ component: SpineRenderer });

export const Primary = meta.story({
  args: {
    spine: {
      atlas: '/spineboy/spineboy.atlas',
      skeleton: '/spineboy/spineboy.json',
    },
    animation: 'run',
    style: {
      width: 700,
      height: 700,
    },
  },
});
