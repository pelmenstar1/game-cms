import preview from '#storybook/preview';

import { SpineController } from './SpineController';

const meta = preview.meta({ component: SpineController });

export const Primary = meta.story({
  args: {
    spine: {
      atlas: '/spineboy/spineboy.atlas',
      skeleton: '/spineboy/spineboy.json',
    },
    style: {
      width: '800px',
      height: '800px',
    },
  },
});
