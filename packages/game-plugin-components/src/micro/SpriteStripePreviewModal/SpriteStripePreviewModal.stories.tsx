import preview from '#storybook/preview';

import { SpriteStripePreviewModal } from './SpriteStripePreviewModal';

const meta = preview.meta({ component: SpriteStripePreviewModal });

export const Primary: unknown = meta.story({
  args: {
    onClose: () => {},
    imageUrl: '/spriteSprite/Apple.png',
    frameWidth: 32,
    frameHeight: 32,
  },
});
