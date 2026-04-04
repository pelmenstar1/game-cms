import fsp from 'node:fs/promises';
import path from 'node:path';

import { build as dashboardBuild } from '@game-cms/dashboard';
import { deleteFileIfExists } from '@game-cms/shared/node';
import { createDashboardBuildLock, writeDashboardBuildMeta } from '@game-cms/ignition';

import {
  getDashboardPackagePath,
  getLocalDashboardBuildPath,
} from '../../services/dashboard/index.js';

async function copyDashboardOutput(dashboardPath: string) {
  const localDashboardPath = getLocalDashboardBuildPath();

  await deleteFileIfExists(localDashboardPath, { recursive: true });
  await fsp.cp(path.join(dashboardPath, 'build/client'), localDashboardPath, {
    recursive: true,
  });
}

export default async function build() {
  const dashboardPath = getDashboardPackagePath();

  await using _ = await createDashboardBuildLock(dashboardPath);

  await writeDashboardBuildMeta(dashboardPath);
  await dashboardBuild();

  await copyDashboardOutput(dashboardPath);
}
