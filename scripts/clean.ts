import fsp from 'node:fs/promises';

import { glob } from 'glob';

const patterns = [
  '*.tsbuildinfo',
  './packages/*/*.tsbuildinfo',
  './packages/*/dist',
  './node_modules/prettier/.prettier-cache',
  './node_modules/.stylelintcache',
  './node_modules/.eslintcache',
];

async function main() {
  const files = await glob(patterns, {
    ignore: ['**/node_modules/**'],
  });

  await Promise.all(files.map((file) => fsp.rm(file, { recursive: true })));
}

void main();
