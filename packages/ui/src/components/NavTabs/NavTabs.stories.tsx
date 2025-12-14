import preview from '#storybook/preview';

import { InfoIcon } from '../../icons';
import { NavTabs } from './NavTabs';

const meta = preview.meta({ component: NavTabs });

export const Primary = meta.story({
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
});
