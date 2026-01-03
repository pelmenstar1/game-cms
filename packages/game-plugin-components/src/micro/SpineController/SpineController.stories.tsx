import preview from '#storybook/preview';

import { SpineController } from './SpineController';

const meta = preview.meta({ component: SpineController });

export const Primary: unknown = meta.story({
  args: {
    spine: {
      atlas: '/spineboy/spineboy.atlas',
      skeleton: '/spineboy/spineboy.json',
      images: ['/spineboy/spineboy.png'],
    },
    style: {
      width: '800px',
      height: '800px',
    },
  },
});
