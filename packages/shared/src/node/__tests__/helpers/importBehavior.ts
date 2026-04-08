import { describe, expect, test } from 'vitest';

import type { MaybeArray } from '../../../collections/maybeArray.js';

type PathType = 'existing' | 'throwing' | 'unknown' | 'importNonExistent';

type ImportBehaviorPaths = Record<PathType, MaybeArray<string>>;

interface ImportBehaviorOptions {
  importFn: (path: string) => Promise<unknown>;
  paths: ImportBehaviorPaths;
  resolvePath?: (path: string) => string;
}

export function describeImportBehavior(
  label: string,
  { importFn, paths, resolvePath = (p) => p }: ImportBehaviorOptions
) {
  function testCase(key: PathType, fn: (p: string) => Promise<void>) {
    const path = paths[key];

    if (Array.isArray(path)) {
      test.each(path)(key, (p) => fn(resolvePath(p)));
    } else {
      test(key, () => fn(resolvePath(path)));
    }
  }

  describe(label, () => {
    testCase('existing', async (path) => {
      await expect(importFn(path)).resolves.not.toBeUndefined();
    });

    testCase('throwing', async (path) => {
      await expect(importFn(path)).rejects.toBeInstanceOf(Error);
    });

    testCase('unknown', async (path) => {
      await expect(importFn(path)).resolves.toBeUndefined();
    });

    testCase('importNonExistent', async (path) => {
      await expect(importFn(path)).rejects.toBeInstanceOf(Error);
    });
  });
}
