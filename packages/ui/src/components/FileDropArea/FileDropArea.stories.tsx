import type { Meta, StoryObj } from '@storybook/react';

import { FileDropArea } from '.';

export default {
  component: FileDropArea,
} satisfies Meta<typeof FileDropArea>;

type Story = StoryObj<typeof FileDropArea>;

export const Primary: Story = {
  args: {},
};
