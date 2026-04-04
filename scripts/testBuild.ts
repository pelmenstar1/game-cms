import chalk from 'chalk';

import { readPackageInfo } from '../packages/shared/src/node';
import { getWorkspacePackages } from '../shared/workspace';
import { printInfo } from './print';
import { pnpm } from './process';

const BUILD_SCRIPT = 'test:build';

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

  for (const { dirPath, name } of workspacePackages) {
    printInfo(`Building ${chalk.blue(name)}`);

    await pnpm(BUILD_SCRIPT, dirPath);
  }
}

void main();
