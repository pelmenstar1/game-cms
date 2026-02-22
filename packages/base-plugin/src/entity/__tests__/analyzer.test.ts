import path from 'node:path';

import { describe, expect, test } from 'vitest';

import { getReExportedSchemaPaths } from '../analyzer.js';

describe('getReExportedSchemaPaths', () => {
  test('two entities', async () => {
    const registryDir = path.join(
      import.meta.dirname,
      'fixtures/two-entities/entities'
    );
    const registryPath = path.join(registryDir, 'registry.ts');

    await expect(getReExportedSchemaPaths(registryPath)).resolves.toEqual({
      test: {
        filePath: path.join(registryDir, 'test.ts'),
      },
      test2: {
        filePath: path.join(registryDir, 'test2.ts'),
      },
    });
  });
});
