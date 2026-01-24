import fsp from 'node:fs/promises';
import path from 'node:path';

import { expect, test } from 'vitest';

import { xxHashFile } from './hash.js';
import { temporalDirectory } from './tempDir.js';

test('xxHashFile', async () => {
  await using tempDir = await temporalDirectory();

  const filePath = path.join(tempDir.path, 'test');
  await fsp.writeFile(filePath, '1'.repeat(1024 * 1024));

  const actual = await xxHashFile(filePath);

  expect(actual).toEqual(254_207_766_878_394_631_403_132_850_659_340_257_961n);
});
