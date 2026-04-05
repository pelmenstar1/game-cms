import fsp from 'node:fs/promises';
import path from 'node:path';

import { glob } from 'glob';
import yaml from 'yaml';

type PnpmWorkspaceInfo = {
  packages: string[];
};

async function readPackageInfo(dirPath: string) {
  const content = await fsp.readFile(
    path.join(dirPath, 'package.json'),
    'utf8'
  );

  return JSON.parse(content) as { name: string };
}

export async function getWorkspacePackages() {
  const cwd = path.join(import.meta.dirname, '../');

  const infoContent = await fsp.readFile(
    path.join(cwd, 'pnpm-workspace.yaml'),
    'utf8'
  );

  const info = yaml.parse(infoContent) as PnpmWorkspaceInfo;

  return glob(info.packages, { cwd, absolute: true });
}

export async function getWorkspacePackageNames() {
  const workspacePaths = await getWorkspacePackages();

  const names = await Promise.all(
    workspacePaths.map(async (p) => {
      const info = await readPackageInfo(p);
      return info.name;
    })
  );

  return new Set(names);
}
