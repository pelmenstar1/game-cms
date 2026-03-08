import { describe, expect, it } from 'vitest';

import { getImageSize } from './utils.js';

describe('getImageSize', () => {
  it('returns size when imageSize has valid width and height', () => {
    const result = getImageSize({ imageSize: { width: 1920, height: 1080 } });

    expect(result).toEqual({ width: 1920, height: 1080 });
  });

  it.each([
    {},
    { imageSize: null },
    { imageSize: 'string' },
    { imageSize: { width: '1920', height: 1080 } },
    { imageSize: { width: 1920, height: '1080' } },
    { imageSize: { width: 1920 } },
    { imageSize: { height: 1080 } },
  ])('returns undefined for invalid addons', (addons) => {
    expect(getImageSize(addons)).toBeUndefined();
  });
});
