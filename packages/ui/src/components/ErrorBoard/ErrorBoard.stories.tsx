import type { Meta, StoryObj } from '@storybook/react';

import { ErrorBoard } from '.';

export default {
  component: ErrorBoard,
} satisfies Meta<typeof ErrorBoard>;

type Story = StoryObj<typeof ErrorBoard>;

export const Primary: Story = {
  args: { items: ['Error 1', 'Error 2'] },
};
