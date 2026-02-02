import { useState } from 'react';

import preview from '#storybook/preview';

import { InfoIcon } from '../../icons';
import {
  IconSwitchButton,
  type IconSwitchButtonProps,
} from './IconSwitchButton';

function Component(props: IconSwitchButtonProps) {
  const [checked, setChecked] = useState(false);

  return (
    <IconSwitchButton
      checked={checked}
      onCheckedChanged={setChecked}
      {...props}
    />
  );
}

const meta = preview.meta({ component: Component });

export const Primary = meta.story({
  args: {
    children: <InfoIcon />,
  },
});
