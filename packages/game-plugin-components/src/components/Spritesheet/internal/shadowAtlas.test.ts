import { expect, test } from 'vitest';

import { createShadowAtlasContent } from './shadowAtlas.js';

const syntheticAtlas = {
  frames: {
    'hero/idle_0': {
      frame: { x: 0, y: 0, w: 64, h: 64 },
      rotated: false,
    },
    'hero/idle_1': {
      frame: { x: 64, y: 0, w: 64, h: 64 },
    },
  },
  meta: {
    image: 'original.png',
    scale: 1,
    size: { w: 512, h: 512 },
  },
};

test('replaces image in meta with filename from url', () => {
  const atlasContent = JSON.stringify(syntheticAtlas);
  const textureUrl = 'https://cdn.example.com/assets/hero.webp';

  const result = createShadowAtlasContent(atlasContent, textureUrl);
  const parsed = JSON.parse(result) as { meta: { image: string } };

  expect(parsed.meta.image).toBe('hero.webp');
});
