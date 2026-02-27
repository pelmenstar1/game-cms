import fsp from 'node:fs/promises';
import path from 'node:path';

import { writeDashboardBuildMeta } from '@game-cms/ignition';
import { redirectProcess } from '@game-cms/shared/node';

import {
  getDashboardPackagePath,
  getLocalDashboardBuildPath,
} from '../../services/dashboard/index.js';

async function runDashboardBuild(dashboardPath: string) {
  await redirectProcess('npm run build', {
    shell: true,
    cwd: dashboardPath,
  });
}

async function copyDashboardOutput(dashboardPath: string) {
  const localDashboardPath = getLocalDashboardBuildPath();

  await fsp.rm(localDashboardPath, { recursive: true });
  await fsp.cp(path.join(dashboardPath, 'build/client'), localDashboardPath, {
    recursive: true,
  });
}

export default async function build() {
  const dashboardPath = getDashboardPackagePath();

  await writeDashboardBuildMeta(dashboardPath);
  await runDashboardBuild(dashboardPath);

  await copyDashboardOutput(dashboardPath);
}
