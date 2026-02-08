import preview from '#storybook/preview';

import { ThreeDModelPreviewModal } from './ThreeDModelPreviewModal';

const meta = preview.meta({ component: ThreeDModelPreviewModal });

export const Primary: unknown = meta.story({
  args: {
    source: '/DamagedHelmet.glb',
    onClose: () => {},
  },
});
