import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { Typography } from '../Typography';
import { ModalDialog } from '.';

export default {
  component: ModalDialog,
} satisfies Meta<typeof ModalDialog>;

type Story = StoryObj<typeof ModalDialog>;

export const Primary: Story = {
  args: {
    title: 'Title',
    children: <Typography>Content</Typography>,
    footer: (
      <>
        <Button>Cancel</Button>
        <Button buttonVariant="solid">OK</Button>
      </>
    ),
  },
};
