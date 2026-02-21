import fs from 'node:fs';
import { Dirent } from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

import { test } from 'vitest';

import { packagesDir } from '../shared/constants';
import { references } from '../tsconfig.ref.json';

function isErrorPackage(entry: Dirent) {
  if (entry.isDirectory()) {
    const hasTsConfig = fs.existsSync(
      path.join(packagesDir, entry.name, 'tsconfig.json')
    );
    const inReferences = references.some(
      ({ path }) => path === `./packages/${entry.name}`
    );

    if (hasTsConfig && !inReferences) {
      return true;
    }
  }

  return false;
}

// Checks whether all packages from packages dir is in tsconfig.ref.json
test('check ref packages', async () => {
  const dirs = await fsp.readdir(packagesDir, { withFileTypes: true });

  const errors = dirs
    .filter((entry) => isErrorPackage(entry))
    .map((entry) => entry.name);

  if (errors.length > 0) {
    throw new Error(
      `Packages ${errors.join(', ')} are not in tsconfig.ref.json`
    );
  }
});
