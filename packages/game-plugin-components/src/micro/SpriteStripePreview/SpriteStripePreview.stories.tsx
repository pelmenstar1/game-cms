import preview from '#storybook/preview';

import { SpriteStripePreview } from './SpriteStripePreview';

const meta = preview.meta({ component: SpriteStripePreview });

export const Primary: unknown = meta.story({
  args: {
    imageUrl: '/spriteSprite/Apple.png',
    frameWidth: 32,
    frameHeight: 32,
  },
});
