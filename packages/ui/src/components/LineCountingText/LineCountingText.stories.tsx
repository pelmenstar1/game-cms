import preview from '#storybook/preview';

import { LineCountingText } from './LineCountingText';

const meta = preview.meta({ component: LineCountingText });

export const Primary = meta.story({
  args: {
    text: 'Line 1\nLine 2\n\nLine 4',
  },
});
