import path from 'node:path';

import { describe, expect, test } from 'vitest';

import { maybeImportFile } from '../import.js';
import { MODULE_NOT_FOUND_MARK } from '../module.js';

function fixture(name: string) {
  return path.join(import.meta.dirname, 'fixtures', name);
}

describe('maybeImportFile', () => {
  test('existing module', async () => {
    await expect(maybeImportFile(fixture('target.js'))).resolves.not.toBe(
      MODULE_NOT_FOUND_MARK
    );
  });

  test('throwing module', async () => {
    await expect(
      maybeImportFile(fixture('throwingModule.js'))
    ).rejects.toBeInstanceOf(Error);
  });

  test('unknown module', async () => {
    await expect(
      maybeImportFile(fixture('nonExistentModule.js'))
    ).resolves.toBe(MODULE_NOT_FOUND_MARK);
  });

  test('module importing non-existent file', async () => {
    await expect(
      maybeImportFile(fixture('importNonExistentFile.js'))
    ).rejects.toBeInstanceOf(Error);
  });
});
