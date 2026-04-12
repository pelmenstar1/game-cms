import chalk from 'chalk';

import { readPackageInfo } from '../packages/shared/src/node';
import { getWorkspacePackages } from '../shared/workspace';
import { printInfo } from './print';
import { pnpm } from './process';

const BUILD_SCRIPT = 'test:build';

// Groups are processed sequentially; packages within a group are built in parallel.
const PACKAGE_GROUPS: string[][] = [
  ['demo-app'],
  ['@demo-platformer/cms'],
  [
    '@demo-platformer/frontend',
    '@game-cms/ui',
    '@game-cms/base-components',
    '@game-cms/game-plugin-components',
  ],
];

async function getPackagesWithBuildScript() {
  const workspacePackages = await getWorkspacePackages();

  const result = await Promise.all(
    workspacePackages.map(async (dirPath) => {
      const packageInfo = await readPackageInfo(dirPath);

      if (packageInfo.scripts?.[BUILD_SCRIPT]) {
        return { dirPath, name: packageInfo.name };
      }
    })
  );

  return result.filter((item) => item !== undefined);
}

async function main() {
  const workspacePackages = await getPackagesWithBuildScript();

  for (const group of PACKAGE_GROUPS) {
    const pkgs = workspacePackages.filter(({ name }) => group.includes(name));

    if (pkgs.length === 0) {
      continue;
    }

    if (pkgs.length === 1) {
      printInfo(`Building ${chalk.blue(pkgs[0].name)}`);
    } else {
      printInfo(
        `Building in parallel: ${pkgs.map(({ name }) => chalk.blue(name)).join(', ')}`
      );
    }

    await Promise.all(pkgs.map(({ dirPath }) => pnpm(BUILD_SCRIPT, dirPath)));
  }
}

void main();
