import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Typography } from '../Typography';
import { Switch, SwitchProps } from '.';

function Component(props: SwitchProps) {
  const [checked, setChecked] = useState(false);

  return <Switch {...props} checked={checked} onCheckedChanged={setChecked} />;
}

export default {
  component: Component,
} satisfies Meta<typeof Component>;

type Story = StoryObj<typeof Component>;

export const Primary: Story = {
  args: {
    children: <Typography>Text</Typography>,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: <Typography>Text</Typography>,
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    checked: true,
    children: <Typography>Text</Typography>,
  },
};
