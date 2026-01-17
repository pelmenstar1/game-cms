import { temporalDirectory } from '@game-cms/shared/io';
import { describe, expect, test } from 'vitest';

import { createNewFileName } from './utils.js';

describe('createNewFileName', () => {
  test('with extension', async () => {
    await using dir = await temporalDirectory();

    const expected = createNewFileName(dir.path, 'image.png');

    expect(expected.endsWith('.png')).toBe(true);
  });

  test('no extension', async () => {
    await using dir = await temporalDirectory();

    const expected = createNewFileName(dir.path, 'image');

    expect(expected.includes('.')).toBe(false);
  });
});
