import type { Meta, StoryObj } from '@storybook/react';

import { Checkbox } from '.';

export default {
  component: Checkbox,
} satisfies Meta<typeof Checkbox>;

type Story = StoryObj<typeof Checkbox>;

export const Primary: Story = {
  args: {
    children: 'text',
  },
};

export const PrimaryDisabled: Story = {
  args: {
    disabled: true,
    children: 'text',
  },
};

export const PrimaryH4: Story = {
  args: {
    variant: 'h4',
    children: 'text',
  },
};
