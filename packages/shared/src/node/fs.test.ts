import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

import { describe, expect, test } from 'vitest';

import { deleteFileIfExists } from './fs.js';
import { temporalDirectory } from './tempDir.js';

describe('deleteFileIfExists', () => {
  test('deletes an existing file', async () => {
    await using tempDir = await temporalDirectory();
    const filePath = path.join(tempDir.path, 'test-file.txt');

    await fsp.writeFile(filePath, 'hello');
    await deleteFileIfExists(filePath);

    expect(fs.existsSync(filePath)).toBe(false);
  });

  test('does not throw when file does not exist', async () => {
    await expect(
      deleteFileIfExists('./does-not-exist.txt')
    ).resolves.toBeUndefined();
  });

  test('deletes a directory recursively', async () => {
    await using tempDir = await temporalDirectory();
    const subDir = path.join(tempDir.path, 'sub');

    await fsp.mkdir(subDir);
    await fsp.writeFile(path.join(subDir, 'file.txt'), 'data');

    await deleteFileIfExists(subDir, { recursive: true });

    expect(fs.existsSync(subDir)).toBe(false);
  });
});
