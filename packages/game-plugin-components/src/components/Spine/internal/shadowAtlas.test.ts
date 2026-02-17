import fsp from 'node:fs/promises';
import path from 'node:path';

import { expect, test } from 'vitest';

import { createShadowAtlasContent } from './shadowAtlas.js';

test('replaces texture url in page', async () => {
  const atlasPath = path.join(
    import.meta.dirname,
    '../../../../public/spineboy/spineboy.atlas'
  );

  const atlasContent = await fsp.readFile(atlasPath, 'utf8');

  const textureUrls = ['123.webp'];

  const actual = createShadowAtlasContent(atlasContent, textureUrls);
  const expected = atlasContent.replace('spineboy123.png', '123.webp');

  expect(actual).toBe(expected);
});
