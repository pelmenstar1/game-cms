import type { Meta, StoryObj } from '@storybook/react';

import { IndeterminateCircularProgress } from '.';

export default {
  component: IndeterminateCircularProgress,
} satisfies Meta<typeof IndeterminateCircularProgress>;

type Story = StoryObj<typeof IndeterminateCircularProgress>;

export const Primary: Story = {
  args: {
    style: { width: '200px', height: '200px' },
  },
};
