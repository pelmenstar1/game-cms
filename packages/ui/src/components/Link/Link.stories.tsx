import type { Meta, StoryObj } from '@storybook/react';

import { Link } from '.';

export default {
  component: Link,
} satisfies Meta<typeof Link>;

type Story = StoryObj<typeof Link>;

export const Primary: Story = {
  args: {
    to: '/test',
    children: 'Text',
  },
};
