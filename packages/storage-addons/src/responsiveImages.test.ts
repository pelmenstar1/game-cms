import sharp from 'sharp';
import { describe, expect, it, vi } from 'vitest';

import { responsiveImages } from './responsiveImages.js';

function createMockContext() {
  const upload = vi.fn().mockResolvedValue({ extra: 'mock-extra', size: 0 });
  const getUrl = vi.fn().mockReturnValue('https://example.com/image.png');

  return {
    provider: {
      protocol: { upload, getUrl },
    },
  } as never;
}

async function createTestImage(width: number, height: number) {
  return sharp({
    create: { width, height, channels: 3, background: { r: 255, g: 0, b: 0 } },
  })
    .png()
    .toBuffer();
}

describe('responsiveImages', () => {
  const addon = responsiveImages({ breakpoints: [200, 400, 800, 1200] });

  it('should generate variants for breakpoints smaller than the image', async () => {
    const image = await createTestImage(1000, 500);
    const context = createMockContext();

    const result = await addon.getData(
      { name: 'photo.png', mime: 'image/png', content: image },
      context
    );

    expect(result).toEqual({
      variants: [
        { size: { width: 200, height: 100 }, extra: 'mock-extra' },
        { size: { width: 400, height: 200 }, extra: 'mock-extra' },
        { size: { width: 800, height: 400 }, extra: 'mock-extra' },
      ],
    });
  });

  it('should skip breakpoints larger than or equal to the image width', async () => {
    const image = await createTestImage(300, 600);
    const context = createMockContext();

    const result = await addon.getData(
      { name: 'small.png', mime: 'image/png', content: image },
      context
    );

    expect(result).toEqual({
      variants: [{ size: { width: 200, height: 400 }, extra: 'mock-extra' }],
    });
  });

  it('should return undefined for non-image content', async () => {
    const context = createMockContext();

    const result = await addon.getData(
      {
        name: 'file.txt',
        mime: 'text/plain',
        content: new Uint8Array([1, 2, 3]),
      },
      context
    );

    expect(result).toBeUndefined();
  });

  it('should return no variants when image is smaller than all breakpoints', async () => {
    const image = await createTestImage(100, 50);
    const context = createMockContext();

    const result = await addon.getData(
      { name: 'tiny.png', mime: 'image/png', content: image },
      context
    );

    expect(result).toEqual({ variants: [] });
  });

  it('should preserve aspect ratio with non-square images', async () => {
    const image = await createTestImage(1600, 900);
    const context = createMockContext();

    const result = await addon.getData(
      { name: 'wide.png', mime: 'image/png', content: image },
      context
    );

    expect(result).toEqual({
      variants: [
        { size: { width: 200, height: 113 }, extra: 'mock-extra' },
        { size: { width: 400, height: 225 }, extra: 'mock-extra' },
        { size: { width: 800, height: 450 }, extra: 'mock-extra' },
        { size: { width: 1200, height: 675 }, extra: 'mock-extra' },
      ],
    });
  });

  it('should hydrate variants with urls from provider', () => {
    const context = createMockContext();

    const result = addon.hydrateData(
      {
        variants: [
          { size: { width: 200, height: 100 }, extra: 'extra-1' },
          { size: { width: 400, height: 200 }, extra: 'extra-2' },
        ],
      },
      context
    );

    expect(result).toEqual({
      variants: [
        {
          size: { width: 200, height: 100 },
          url: 'https://example.com/image.png',
        },
        {
          size: { width: 400, height: 200 },
          url: 'https://example.com/image.png',
        },
      ],
    });
  });
});
