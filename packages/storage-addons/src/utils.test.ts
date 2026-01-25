import { describe, expect, it } from 'vitest';

import { filePathWithWidth, tryGetImageMeta } from './utils.js';

describe('filePathWithWidth', () => {
  it.each([
    ['images/photo.png', 200, 'images/photo-200.png'],
    ['path/to/file.jpg', 800, 'path/to/file-800.jpg'],
    ['photo.png', 100, '/photo-100.png'],
    ['images/photo', 300, 'images/photo-300'],
    ['file', 400, '/file-400'],
    ['images/photo.test.png', 500, 'images/photo.test-500.png'],
    ['a/b/c/image.webp', 1200, 'a/b/c/image-1200.webp'],
  ])('filePathWithWidth(%s, %d) -> %s', (filePath, width, expected) => {
    expect(filePathWithWidth(filePath, width)).toBe(expected);
  });
});

describe('tryGetImageMeta', () => {
  it('should return undefined for invalid image data', async () => {
    const invalidData = new Uint8Array([0, 1, 2, 3]);
    const result = await tryGetImageMeta(invalidData);
    expect(result).toBeUndefined();
  });

  it('should return undefined for empty data', async () => {
    const emptyData = new Uint8Array(0);
    const result = await tryGetImageMeta(emptyData);
    expect(result).toBeUndefined();
  });

  it('should return metadata for valid PNG', async () => {
    // Minimal valid 1x1 red PNG
    const pngData = new Uint8Array([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xde, 0x00, 0x00, 0x00,
      0x0c, 0x49, 0x44, 0x41, 0x54, 0x08, 0xd7, 0x63, 0xf8, 0xcf, 0xc0, 0x00,
      0x00, 0x00, 0x03, 0x00, 0x01, 0x00, 0x05, 0xfe, 0xd4, 0xef, 0x00, 0x00,
      0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
    ]);

    const result = await tryGetImageMeta(pngData);

    expect(result).toBeDefined();
    expect(result?.format).toBe('png');
    expect(result?.width).toBe(1);
    expect(result?.height).toBe(1);
  });
});
