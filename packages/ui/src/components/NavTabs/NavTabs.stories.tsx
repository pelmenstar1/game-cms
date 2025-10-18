import type { Meta, StoryObj } from '@storybook/react';

import { InfoIcon } from '../../icons';
import { NavTabs } from './NavTabs';

export default {
  component: NavTabs,
} satisfies Meta<typeof NavTabs>;

type Story = StoryObj<typeof NavTabs>;

export const Primary: Story = {
  args: {
    items: [
      {
        href: '/',
        icon: <InfoIcon />,
        text: 'Text',
      },
      {
        href: '/2',
        icon: <InfoIcon />,
        text: 'Text',
      },
      {
        href: '/3',
        icon: <InfoIcon />,
        text: 'Text',
      },
    ],
  },
};
