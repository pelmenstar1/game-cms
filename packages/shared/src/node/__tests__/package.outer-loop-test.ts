import { execFile } from 'node:child_process';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { describe, expect, test } from 'vitest';

import { resolveImport } from '../package.js';

function convertToDistPath(filePath: string) {
  return filePath.replace(path.join('src', 'node'), () =>
    path.join('dist', 'node')
  );
}

function fixture(name: string) {
  return path.join(import.meta.dirname, 'fixtures', name);
}

async function runRemoteTest(filePath: string) {
  const distPath = convertToDistPath(filePath);

  return new Promise<void>((resolve, reject) => {
    execFile('node', [distPath], (error) => {
      if (error) {
        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
        reject(error);
      } else {
        resolve(undefined);
      }
    });
  });
}

describe('resolveImport', () => {
  test('vitest env', () => {
    const FILE = '../buffer.js';

    const actual = resolveImport(import.meta, FILE);

    expect(actual).toEqual(
      pathToFileURL(path.join(import.meta.dirname, FILE)).href
    );
  });

  test('cjs', async () => {
    await runRemoteTest(fixture('packageTest.cjs'));
  });

  test('mjs', async () => {
    await runRemoteTest(fixture('packageTest.mjs'));
  });
});
