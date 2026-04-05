import { describe, expect, test } from 'vitest';

import { getRendererVariantFromFilePath } from './gather.js';

describe('getRendererVariantFromFilePath', () => {
  test.each([
    ['renderer.default.js', 'default'],
    ['renderer.listPreview.js', 'listPreview'],
    ['renderer.a.b.js', 'a.b'],
    ['renderer.card.js', 'card'],
    ['/some/path/renderer.default.js', 'default'],
    ['C:/some/path/renderer.listPreview.js', 'listPreview'],
  ])('match - %s', (input, expected) => {
    expect(getRendererVariantFromFilePath(input)).toBe(expected);
  });

  test.each([
    ['renderer.js'],
    ['renderer.default.ts'],
    ['core.js'],
    ['index.js'],
    ['renderer.default.jsx'],
    [''],
  ])('no match - %s', (input) => {
    expect(getRendererVariantFromFilePath(input)).toBeNull();
  });
});
