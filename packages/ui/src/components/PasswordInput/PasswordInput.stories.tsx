import type { Meta, StoryObj } from '@storybook/react';

import { PasswordInput } from '.';

export default {
  component: PasswordInput,
} satisfies Meta<typeof PasswordInput>;

type Story = StoryObj<typeof PasswordInput>;

export const Primary: Story = {
  args: {},
};
