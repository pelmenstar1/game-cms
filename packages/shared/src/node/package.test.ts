import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, test } from 'vitest';

import { findNearestPackageRoot } from './package.js';

async function withTempDir(fn: (dir: string) => Promise<void>) {
  const dir = await fsp.mkdtemp(path.join(os.tmpdir(), 'pkg-test-'));

  try {
    await fn(dir);
  } finally {
    await fsp.rm(dir, { recursive: true });
  }
}

describe('findNearestPackageRoot', () => {
  test('returns the directory itself when package.json is present', async () => {
    await withTempDir(async (dir) => {
      await fsp.writeFile(path.join(dir, 'package.json'), '{}');
      expect(findNearestPackageRoot(dir)).toBe(dir);
    });
  });

  test('walks up to find package.json in a parent directory', async () => {
    await withTempDir(async (dir) => {
      await fsp.writeFile(path.join(dir, 'package.json'), '{}');

      const nested = path.join(dir, 'src', 'utils');
      await fsp.mkdir(nested, { recursive: true });
      expect(findNearestPackageRoot(nested)).toBe(dir);
    });
  });

  test('finds package.json in an intermediate directory', async () => {
    await withTempDir(async (dir) => {
      const mid = path.join(dir, 'packages', 'foo');

      await fsp.mkdir(mid, { recursive: true });
      await fsp.writeFile(path.join(mid, 'package.json'), '{}');

      const deep = path.join(mid, 'src', 'internal');
      await fsp.mkdir(deep, { recursive: true });

      expect(findNearestPackageRoot(deep)).toBe(mid);
    });
  });

  test('throws when no package.json exists in any ancestor', async () => {
    await withTempDir(async (dir) => {
      const nested = path.join(dir, 'a', 'b', 'c');
      await fsp.mkdir(nested, { recursive: true });
      // no package.json anywhere in dir tree
      expect(() => findNearestPackageRoot(nested)).toThrow(
        `No package.json found starting from: ${nested}`
      );
    });
  });
});
