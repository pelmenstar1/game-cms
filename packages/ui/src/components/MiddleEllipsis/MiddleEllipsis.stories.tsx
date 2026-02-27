import preview from '#storybook/preview';

import { MiddleEllipsis } from './MiddleEllipsis';

const meta = preview.meta({ component: MiddleEllipsis });

export const Primary = meta.story({
  args: {
    children: 'abcdefghijklmnopqrstuvwxyz',
    style: {
      width: '100px',
    },
  },
});
