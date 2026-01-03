import fsp from 'node:fs/promises';
import path from 'node:path';

import type { DashboardMeta } from '@game-cms/types';

export async function writeDashboardMeta(dashboardPath: string) {
  const cwd = process.cwd();

  const meta: DashboardMeta = {
    basePath: cwd,
  };

  await fsp.writeFile(
    path.join(dashboardPath, '.game-cms', 'meta.json'),
    JSON.stringify(meta),
    'utf8'
  );
}
