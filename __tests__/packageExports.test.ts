import fs from 'node:fs';
import path from 'node:path';

import { expect, test } from 'vitest';

import { PackageInfo, readPackageInfo } from '../packages/shared/src/node';
import { getWorkspacePackages } from '../shared/workspace';

function getPackageInfoReferencedExports(
  baseDir: string,
  packageInfo: PackageInfo
) {
  const { exports, main, types } = packageInfo;

  const result = new Set<string | undefined>([main, types]);

  if (exports) {
    for (const { import: importPath, types } of Object.values(exports)) {
      result.add(importPath);
      result.add(types);
    }
  }

  return [...result]
    .filter((item) => item !== undefined)
    .map((relPath) => path.join(baseDir, relPath));
}

async function checkPackage(dirPath: string) {
  const packageInfo = await readPackageInfo(dirPath);
  const referencedFiles = getPackageInfoReferencedExports(dirPath, packageInfo);

  const unknownFiles = referencedFiles.filter(
    (filePath) => !fs.existsSync(filePath)
  );

  expect(unknownFiles, `package: ${dirPath}`).toEqual([]);
}

test('Packages export should reference existing files', async () => {
  const packageDirs = await getWorkspacePackages();

  await Promise.all(packageDirs.map((dirPath) => checkPackage(dirPath)));
});
