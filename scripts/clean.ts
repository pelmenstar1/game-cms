import fsp from 'node:fs/promises';

import { glob } from 'glob';

const patterns = [
  '*.tsbuildinfo',
  './packages/*/*.tsbuildinfo',
  './packages/*/dist',
  './.stylelintcache',
  './.eslintcache',
];

async function main() {
  const files = await glob(patterns, {
    ignore: ['**/node_modules/**'],
  });

  await Promise.all(
    files.map(async (file) => {
      await fsp.rm(file, { recursive: true });
    })
  );
}

void main();
