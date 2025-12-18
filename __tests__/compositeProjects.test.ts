import fsp from 'node:fs/promises';
import path from 'node:path';

import { expect, test } from 'vitest';

import { readJson } from '../packages/shared/src/io/file';

type TsConfig = {
  compilerOptions?: {
    composite?: boolean;
  };
};

async function checkTsconfig(filePath: string) {
  const config = await readJson<TsConfig>(filePath);

  expect(
    config.compilerOptions?.composite,
    `Expected ${filePath} project to be composite`
  ).toEqual(true);
}

test('composite TS projects', async () => {
  const packagesDir = path.join(import.meta.dirname, '../packages');
  const entries = await fsp.readdir(packagesDir);

  await checkTsconfig(
    path.join(import.meta.dirname, '../demo-app/tsconfig.json')
  );
  await Promise.all(
    entries.map((name) => {
      const tsconfigPath = path.join(packagesDir, name, 'tsconfig.json');

      return checkTsconfig(tsconfigPath);
    })
  );
});
