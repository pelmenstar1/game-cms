import { createJiti } from 'jiti';
import { describe, expect, test } from 'vitest';

import { maybeJitiImport } from '../jiti.js';
import { MODULE_NOT_FOUND_MARK } from '../module.js';

describe('maybeJitiImport', () => {
  test('existing module', async () => {
    const jiti = createJiti(import.meta.url);

    await expect(maybeJitiImport(jiti, './remoteTest.ts')).resolves.not.toBe(
      MODULE_NOT_FOUND_MARK
    );
  });

  test('throwing module', async () => {
    const jiti = createJiti(import.meta.url);

    await expect(
      maybeJitiImport(jiti, './fixtures/throwingModule.js')
    ).rejects.toBeInstanceOf(Error);
  });

  test('unknown module', async () => {
    const jiti = createJiti(import.meta.url);

    await expect(
      maybeJitiImport(jiti, './fixtures/nonExistentModule.js')
    ).resolves.toBe(MODULE_NOT_FOUND_MARK);
  });
});
