import preview from '#storybook/preview';

import { Link } from '.';

const meta = preview.meta({ component: Link });

export const Primary = meta.story({
  args: {
    to: '/test',
    children: 'Text',
  },
});
