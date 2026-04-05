import preview from '#storybook/preview';

import { Pagination } from '.';

const meta = preview.meta({ component: Pagination });

export const Link = meta.story({
  args: {
    current: 2,
    total: 5,
    getLink: () => '#',
  },
});

export const Button = meta.story({
  args: {
    current: 2,
    total: 5,
    onButtonClick: () => {},
  },
});
