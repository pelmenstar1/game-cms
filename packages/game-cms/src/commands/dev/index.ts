import childProcess from 'node:child_process';

import { setCmsController } from '@game-cms/global';
import { delay } from '@game-cms/shared';

import { writeComponentsFsInfo } from '../../services/components.js';
import { createController } from '../../services/controller.js';
import { getDashboardPackagePath } from '../../services/dashboard.js';
import { startServer } from '../../services/server.js';
import { initEnvFromConfigs } from '../start/env.js';

async function isDevServerUp() {
  try {
    await fetch('http://localhost:5173', { method: 'HEAD' });

    return true;
  } catch {
    return false;
  }
}

async function waitUntilDevServerStarts() {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  while (true) {
    if (await isDevServerUp()) {
      return;
    }

    await delay(500);
  }
}

function runDashboardDev(dashboardPath: string) {
  const p = childProcess.spawn('npm', ['run', 'dev'], {
    shell: true,
    cwd: dashboardPath,
  });

  p.stdout.pipe(process.stdout);
  p.stderr.pipe(process.stderr);
}

export default async function dev() {
  const dashboardPath = getDashboardPackagePath();

  await writeComponentsFsInfo(dashboardPath);
  await initEnvFromConfigs();

  setCmsController(createController());

  runDashboardDev(dashboardPath);

  await waitUntilDevServerStarts();

  void startServer({ dashboard: 'http://localhost:5173' });
}
