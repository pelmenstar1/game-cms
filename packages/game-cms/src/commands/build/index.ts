import fsp from 'node:fs/promises';
import path from 'node:path';

import { redirectProcess } from '@game-cms/shared/node';

import { writeComponentsFsInfo } from '../../services/components.js';
import { getDashboardPackagePath } from '../../services/dashboard.js';

async function runDashboardBuild(dashboardPath: string) {
  await redirectProcess('npm run build', {
    shell: true,
    cwd: dashboardPath,
  });
}

async function copyDashboardOutput(dashboardPath: string) {
  await fsp.cp(path.join(dashboardPath, 'build/client'), './build', {
    recursive: true,
  });
}

export default async function build() {
  const dashboardPath = getDashboardPackagePath();

  await writeComponentsFsInfo(dashboardPath);
  await runDashboardBuild(dashboardPath);

  await copyDashboardOutput(dashboardPath);
}
