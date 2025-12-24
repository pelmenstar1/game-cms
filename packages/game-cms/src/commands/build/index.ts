import { redirectProcess } from '@game-cms/shared/node';

import { writeComponentsFsInfo } from '../../services/components.js';
import { getDashboardPackagePath } from '../../services/dashboard.js';

async function runDashboardBuild(dashboardPath: string) {
  await redirectProcess('npm', ['run', 'build'], {
    shell: true,
    cwd: dashboardPath,
  });
}

export default async function build() {
  const dashboardPath = getDashboardPackagePath();

  await writeComponentsFsInfo(dashboardPath);
  await runDashboardBuild(dashboardPath);
}
