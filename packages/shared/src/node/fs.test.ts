import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

import { describe, expect, test } from 'vitest';

import { deleteFileIfExists, readDirectoryIfExists } from './fs.js';
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

describe('readDirectoryIfExists', () => {
  test('returns entries for an existing directory', async () => {
    const result = await readDirectoryIfExists(import.meta.dirname);

    expect(result.length).toBeGreaterThan(0);
  });

  test('returns [] for a non-existent directory', async () => {
    const result = await readDirectoryIfExists(
      path.join(import.meta.dirname, 'nonExistent')
    );

    expect(result).toEqual([]);
  });

  test('returns Dirent entries when withFileTypes is true', async () => {
    await using tempDir = await temporalDirectory();
    await fsp.writeFile(path.join(tempDir.path, 'file.txt'), '');

    const result = await readDirectoryIfExists(tempDir.path, {
      withFileTypes: true,
    });

    expect(result.every((entry) => entry instanceof fs.Dirent)).toBe(true);
  });

  test('throws for a non-permission error', async () => {
    await expect(readDirectoryIfExists(import.meta.filename)).rejects.toThrow();
  });
});
