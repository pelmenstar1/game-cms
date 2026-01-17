import preview from '#storybook/preview';

import { InfoIcon } from '../../icons';
import { IconButton } from '../IconButton';
import { Toolbar } from './Toolbar';

const meta = preview.meta({ component: Toolbar });

export const Primary = meta.story({
  args: {
    children: [
      <IconButton key={1} title="info">
        <InfoIcon />
      </IconButton>,
      <IconButton key={2} title="info">
        <InfoIcon />
      </IconButton>,
    ],
  },
});
