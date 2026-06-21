import fsp from 'node:fs/promises';
import path from 'node:path';

import XMLBuilder from 'fast-xml-builder';
import { XMLParser } from 'fast-xml-parser';
import { expect, test } from 'vitest';

import { createShadowAtlasContent } from './shadowAtlas.js';

function minifyXml(xml: string): string {
  const parser = new XMLParser({
    ignoreAttributes: false,
  });

  const doc = parser.parse(xml) as unknown;

  return new XMLBuilder({
    ignoreAttributes: false,
  }).build(doc);
}

test('replaces texture url in page element', async () => {
  const fntPath = path.join(
    import.meta.dirname,
    '../../../../public/fonts/msdf/PinyonScript-Regular.fnt'
  );

  const fntContent = await fsp.readFile(fntPath, 'utf8');

  const textureUrls = ['123.webp'];

  const actual = createShadowAtlasContent(fntContent, textureUrls);
  const expected = minifyXml(fntContent.replace('Pinyon.webp', '123.webp'));

  expect(actual).toBe(expected);
});
