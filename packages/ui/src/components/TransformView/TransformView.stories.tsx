import preview from '#storybook/preview';

import { TransformView } from './TransformView';

const meta = preview.meta({ component: TransformView });

export const Primary = meta.story({
  args: {
    children: <img src="https://i.imgur.com/gbt7JG7.jpg" />,
    style: {
      width: '100%',
      height: '100%',
    },
  },
});
