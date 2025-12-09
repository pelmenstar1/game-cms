import fsp from 'node:fs/promises';

import { glob } from 'glob';

const patterns = [
  './packages/*/tsconfig.tsbuildinfo',
  './packages/*/dist',
  './.stylelintcache',
  './.eslintcache',
];

async function main() {
  const files = await glob(patterns);

  await Promise.all(
    files.map(async (file) => {
      await fsp.rm(file, { recursive: true });
    })
  );
}

void main();
