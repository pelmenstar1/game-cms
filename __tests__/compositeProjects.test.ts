import fsp from 'node:fs/promises';
import path from 'node:path';

import { expect, test } from 'vitest';

import { readJson5 } from '../packages/shared/src/node/file';
import { packagesDir } from '../shared/constants';
import { TsConfig } from '../shared/types';

async function checkTsconfig(filePath: string) {
  const config = await readJson5<TsConfig>(filePath);

  if (config.extends === undefined) {
    expect(
      config.compilerOptions?.composite,
      `Expected ${filePath} project to be composite`
    ).toEqual(true);
  }
}

test('composite TS projects', async () => {
  const entries = await fsp.readdir(packagesDir);

  await checkTsconfig(
    path.join(import.meta.dirname, '../demo-app/tsconfig.json')
  );

  await Promise.all(
    entries.map((name) => {
      return checkTsconfig(path.join(packagesDir, name, 'tsconfig.json'));
    })
  );
});
