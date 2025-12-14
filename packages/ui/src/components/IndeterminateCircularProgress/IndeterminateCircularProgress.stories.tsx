import preview from '#storybook/preview';

import { IndeterminateCircularProgress } from '.';

const meta = preview.meta({ component: IndeterminateCircularProgress });

export const Primary = meta.story({
  args: {
    style: { width: '200px', height: '200px' },
  },
});
