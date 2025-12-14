import preview from '#storybook/preview';

import { Pagination } from '.';

const meta = preview.meta({ component: Pagination });

export const Primary = meta.story({
  args: {
    current: 2,
    total: 5,
    getLink: () => '#',
  },
});
