import fsp from 'node:fs/promises';

import { glob } from 'glob';

import { getWorkspacePackages } from '../shared/workspace';

async function findFiles() {
  const workspacePackages = await getWorkspacePackages();

  const patterns = [
    '*.tsbuildinfo',
    ...workspacePackages.flatMap((dirPath) => [
      `${dirPath}/dist`,
      `${dirPath}/*.tsbuildinfo`,
    ]),
  ];

  const files = await glob(patterns, {
    ignore: ['**/node_modules/**'],
  });

  return [
    ...files,
    './node_modules/.cache/prettier/.prettier-cache',
    './node_modules/.cache/.stylelintcache',
    './node_modules/.cache/.eslintcache',
  ];
}

async function main() {
  const files = await findFiles();

  await Promise.all(
    files.map((file) => fsp.rm(file, { recursive: true, force: true }))
  );
}

void main();
