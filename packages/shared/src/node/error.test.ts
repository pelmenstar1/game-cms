import fsp from 'node:fs/promises';

import { expect, test } from 'vitest';

import { temporalDirectory } from '../node/io/tempDir.js';
import { isEntityExistsError, isFileNotFoundError } from './error.js';

async function getError(factory: () => Promise<unknown>) {
  try {
    await factory();
    expect.fail('should have failed');
  } catch (error) {
    return error;
  }
}

test('isFileNotFoundError', async () => {
  const error = await getError(() => fsp.readFile('./.should-not-exist'));

  expect(isFileNotFoundError(error)).toBe(true);
});

test('isEntityExistsError', async () => {
  await using tempDir = await temporalDirectory();
  const error = await getError(() => fsp.mkdir(tempDir.path));

  expect(isEntityExistsError(error)).toBe(true);
});
