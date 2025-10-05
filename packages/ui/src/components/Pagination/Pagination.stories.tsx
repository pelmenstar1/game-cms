import type { Meta, StoryObj } from '@storybook/react';

import { Pagination } from '.';

export default {
  component: Pagination,
} satisfies Meta<typeof Pagination>;

type Story = StoryObj<typeof Pagination>;

export const Primary: Story = {
  args: {
    current: 2,
    total: 5,
    getLink: () => '#',
  },
};
