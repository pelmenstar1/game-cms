import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { describe, expect, test } from 'vitest';

import { resolveImport } from '../package.js';
import { runRemoteTest } from './remoteTest.js';

describe('resolveImport', () => {
  test('vitest env', () => {
    const FILE = '../buffer.js';

    const actual = resolveImport(import.meta, FILE);

    expect(actual).toEqual(
      pathToFileURL(path.join(import.meta.dirname, FILE)).href
    );
  });

  test('cjs', async () => {
    await runRemoteTest(
      path.join(import.meta.dirname, 'fixtures', 'packageTest.cjs')
    );
  });

  test('mjs', async () => {
    await runRemoteTest(
      path.join(import.meta.dirname, 'fixtures', 'packageTest.mjs')
    );
  });
});
