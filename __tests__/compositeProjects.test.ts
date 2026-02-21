import fsp from 'node:fs/promises';
import path from 'node:path';

import { expect, test } from 'vitest';

import { readTsConfig } from '../packages/shared/src/node';
import { packagesDir } from '../shared/constants';

async function checkTsconfig(dirPath: string) {
  const config = await readTsConfig(dirPath);

  if (config.extends === undefined) {
    expect(
      config.compilerOptions?.composite,
      `Expected ${dirPath} project to be composite`
    ).toEqual(true);
  }
}

test('composite TS projects', async () => {
  const entries = await fsp.readdir(packagesDir);

  await checkTsconfig(path.join(import.meta.dirname, '../demo-app'));

  await Promise.all(
    entries.map((name) => {
      return checkTsconfig(path.join(packagesDir, name));
    })
  );
});
