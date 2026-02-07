import fs from 'node:fs';
import path from 'node:path';

import { glob } from 'glob';
import { expect, test } from 'vitest';

import { readJson } from '../packages/shared/src/node/io/file';
import { PackageInfo } from './types';

function getPackageInfoReferencedExports(
  baseDir: string,
  packageInfo: PackageInfo
) {
  const { exports, main, types } = packageInfo;

  const result = new Set<string>();

  if (main) {
    result.add(main);
  }

  if (types) {
    result.add(types);
  }

  if (exports) {
    for (const { import: importPath, types } of Object.values(exports)) {
      if (importPath) {
        result.add(importPath);
      }

      if (types) {
        result.add(types);
      }
    }
  }

  return [...result].map((relPath) => path.join(baseDir, relPath));
}

test('Packages export should reference existing files', async () => {
  const packageFiles = await glob('packages/*/package.json', {
    cwd: path.join(import.meta.dirname, '..'),
    absolute: true,
  });

  await Promise.all(
    packageFiles.map(async (packageFile) => {
      const packageInfo = await readJson<PackageInfo>(packageFile);
      const referencedFiles = getPackageInfoReferencedExports(
        path.dirname(packageFile),
        packageInfo
      );

      const unknownFiles = referencedFiles.filter(
        (filePath) => !fs.existsSync(filePath)
      );

      expect(unknownFiles, `package: ${packageFile}`).toEqual([]);
    })
  );
});
