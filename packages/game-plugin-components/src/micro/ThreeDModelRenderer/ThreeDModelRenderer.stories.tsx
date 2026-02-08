import preview from '#storybook/preview';

import { ThreeDModelRenderer } from './ThreeDModelRenderer';

const meta = preview.meta({ component: ThreeDModelRenderer });

export const Primary: unknown = meta.story({
  args: {
    source: '/DamagedHelmet.glb',
  },
});
