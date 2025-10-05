import type { Meta, StoryObj } from '@storybook/react';

import { Typography } from '../Typography';
import { ModalOverlay } from '.';

function Component({ effect }: { effect: 'tint' | 'blur' }) {
  return (
    <div>
      <Typography>Some content</Typography>

      <ModalOverlay effect={effect} />
    </div>
  );
}

export default {
  component: Component,
} satisfies Meta<typeof Component>;

type Story = StoryObj<typeof Component>;

export const Tint: Story = {
  args: { effect: 'tint' },
};

export const Blur: Story = {
  args: { effect: 'blur' },
};
