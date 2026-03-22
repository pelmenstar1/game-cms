import path from 'node:path';

import { describe, expect, test } from 'vitest';

import { getComponentIdFromClientFile } from '../core.js';

describe('getComponentIdFromClientFile', () => {
  test('file does not exist', async () => {
    const actual = await getComponentIdFromClientFile(
      path.join(import.meta.dirname, 'fixtures/nonExistentFile.js')
    );

    expect(actual).toBeNull();
  });

  test('should return the correct component ID', async () => {
    const actual = await getComponentIdFromClientFile(
      path.join(import.meta.dirname, 'fixtures/testClient.js')
    );

    expect(actual).toBe('test-core');
  });
});
