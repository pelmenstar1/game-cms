import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '.';

export default {
  component: Button,
} satisfies Meta<typeof Button>;

type Story = StoryObj<typeof Button>;

export const Solid: Story = {
  args: {
    buttonVariant: 'solid',
    children: 'Solid',
  },
};

export const SolidDisabled: Story = {
  args: {
    buttonVariant: 'solid',
    disabled: true,
    children: 'Solid',
  },
};

export const Outlined: Story = {
  args: {
    buttonVariant: 'outlined',
    children: 'Outlined',
  },
};

export const OutlinedDisabled: Story = {
  args: {
    buttonVariant: 'outlined',
    disabled: true,
    children: 'Outlined',
  },
};

export const Flat: Story = {
  args: {
    buttonVariant: 'flat',
    children: 'Flat',
  },
};

export const FlatDisabled: Story = {
  args: {
    buttonVariant: 'flat',
    disabled: true,
    children: 'Flat',
  },
};
