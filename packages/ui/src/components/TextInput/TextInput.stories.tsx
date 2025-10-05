import type { Meta, StoryObj } from '@storybook/react';

import { TextInput } from '.';

export default {
  component: TextInput,
} satisfies Meta<typeof TextInput>;

type Story = StoryObj<typeof TextInput>;

export const Bordered: Story = {
  args: {
    value: 'Text',
  },
};

export const Underline: Story = {
  args: {
    variant: 'underline',
    value: 'Text',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Error: Story = {
  args: {
    error: 'Error',
  },
};
