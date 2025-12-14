import { useState } from 'react';

import preview from '#storybook/preview';

import { Typography } from '../Typography';
import { Switch, type SwitchProps } from '.';

function Component(props: SwitchProps) {
  const [checked, setChecked] = useState(false);

  return <Switch {...props} checked={checked} onCheckedChanged={setChecked} />;
}

const meta = preview.meta({ component: Component });

export const Primary = meta.story({
  args: {
    checked: false,
    children: <Typography>Text</Typography>,
  },
});

export const Disabled = meta.story({
  args: {
    checked: false,
    disabled: true,
    children: <Typography>Text</Typography>,
  },
});

export const DisabledChecked = meta.story({
  args: {
    disabled: true,
    checked: true,
    children: <Typography>Text</Typography>,
  },
});
