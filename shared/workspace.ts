import fsp from 'node:fs/promises';
import path from 'node:path';

import { glob } from 'glob';
import yaml from 'yaml';

type PnpmWorkspaceInfo = {
  packages: string[];
};

export async function getWorkspacePackages() {
  const cwd = path.join(import.meta.dirname, '../');

  const infoContent = await fsp.readFile(
    path.join(cwd, 'pnpm-workspace.yaml'),
    'utf8'
  );

  const info = yaml.parse(infoContent) as PnpmWorkspaceInfo;

  return glob(info.packages, { cwd, absolute: true });
}
