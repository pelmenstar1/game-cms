import fsp from 'node:fs/promises';

import { glob } from 'glob';

import { getWorkspacePackages } from '../shared/workspace';

const STATIC_PATTERNS = [
  '*.tsbuildinfo',
  './node_modules/prettier/.prettier-cache',
  './node_modules/.stylelintcache',
  './node_modules/.eslintcache',
];

async function main() {
  const workspacePackages = await getWorkspacePackages();

  const patterns = [
    ...STATIC_PATTERNS,
    ...workspacePackages.flatMap((dirPath) => [
      `${dirPath}/dist`,
      `${dirPath}/*.tsbuildinfo`,
    ]),
  ];

  const files = await glob(patterns, {
    ignore: ['**/node_modules/**'],
  });

  await Promise.all(files.map((file) => fsp.rm(file, { recursive: true })));
}

void main();
