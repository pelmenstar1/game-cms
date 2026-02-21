import fsp from 'node:fs/promises';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { imageSize } from './imageSize.js';

const context = { provider: {} as never };

describe('imageSize', () => {
  const addon = imageSize();

  it('should return correct size for a valid image', async () => {
    const pngData = await fsp.readFile(
      path.join(import.meta.dirname, '../test-assets/spineboy.png')
    );

    const result = await addon.getData(
      { name: 'test.png', mime: 'image/png', content: pngData },
      context
    );

    expect(result).toEqual({ width: 1024, height: 256 });
  });

  it('should return undefined for a non-image file', async () => {
    const textContent = Buffer.from('hello world', 'utf8');

    const result = await addon.getData(
      { name: 'file.txt', mime: 'text/plain', content: textContent },
      context
    );

    expect(result).toBeUndefined();
  });

  it('should pass through data in hydrateData', () => {
    const size = { width: 100, height: 200 };

    expect(addon.hydrateData(size, context)).toEqual(size);
  });
});
