import fsp from 'node:fs/promises';
import path from 'node:path';

import { describe, expect, test } from 'vitest';

import { createFileLock } from './fileLock.js';
import { temporalDirectory } from './tempDir.js';

describe('createFileLock', () => {
  test('should create a lock file and dispose it correctly', async () => {
    await using tempDir = await temporalDirectory();

    const lockPath = path.join(tempDir.path, 'lockfile.lock');

    const lock = await createFileLock(lockPath);

    // Check if the lock file was created
    await expect(fsp.access(lockPath)).resolves.not.toThrow();

    // Dispose the lock and check if the file was removed
    await lock[Symbol.asyncDispose]();
    await expect(fsp.access(lockPath)).rejects.toThrow();
  });

  test('should throw an error if the lock file already exists', async () => {
    await using tempDir = await temporalDirectory();

    const lockPath = path.join(tempDir.path, 'lockfile.lock');

    await createFileLock(lockPath);

    await expect(createFileLock(lockPath)).rejects.toThrow();
  });
});
