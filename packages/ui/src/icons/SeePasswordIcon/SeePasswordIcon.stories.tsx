import type { Meta, StoryObj } from '@storybook/react';

import { SeePasswordIcon } from '.';

export default {
  component: SeePasswordIcon,
} satisfies Meta<typeof SeePasswordIcon>;

type Story = StoryObj<typeof SeePasswordIcon>;

export const Primary: Story = {
  args: {
    active: true,
  },
};
