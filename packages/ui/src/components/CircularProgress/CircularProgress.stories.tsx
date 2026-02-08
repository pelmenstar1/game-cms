import preview from '#storybook/preview';

import { CircularProgress } from './CircularProgress';

const meta = preview.meta({ component: CircularProgress });

export const Primary = meta.story({
  args: {
    progress: 0.7,
  },
  argTypes: {
    progress: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
    },
  },
});
