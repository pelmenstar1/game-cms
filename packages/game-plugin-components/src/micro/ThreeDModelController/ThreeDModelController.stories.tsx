import preview from '#storybook/preview';

import { ThreeDModelController } from './ThreeDModelController';

const meta = preview.meta({ component: ThreeDModelController });

export const Primary: unknown = meta.story({
  args: {
    source: '/DamagedHelmet.glb',
    style: {
      height: '500px',
    },
  },
});
