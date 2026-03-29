import path from 'node:path';

import { test } from 'vitest';

import { workspaceRoot } from '../shared/constants';
import { getWorkspacePackages } from '../shared/workspace';
import { references } from '../tsconfig.ref.json';

function isErrorPackage(dirPath: string) {
  const relativePath = path
    .relative(workspaceRoot, dirPath)
    .replaceAll('\\', '/');

  const inReferences = references.some(
    ({ path }) => path === `./${relativePath}`
  );

  return !inReferences;
}

// Checks whether all packages is in tsconfig.ref.json
test('check ref packages', async () => {
  const dirs = await getWorkspacePackages();
  const errors = dirs.filter((entry) => isErrorPackage(entry));

  if (errors.length > 0) {
    throw new Error(
      `Packages ${errors.join(', ')} are not in tsconfig.ref.json`
    );
  }
});
