import path from 'node:path';

import { expect, test } from 'vitest';

import { getComponentIdFromCoreFile } from '../core.js';

test('getComponentIdFromCoreFile', async () => {
  const actual = await getComponentIdFromCoreFile(
    path.join(import.meta.dirname, 'fixtures/testCore.js')
  );

  expect(actual).toBe('test-core');
});
