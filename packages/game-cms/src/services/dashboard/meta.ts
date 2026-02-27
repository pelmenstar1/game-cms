import fsp from 'node:fs/promises';
import path from 'node:path';

import type { DashboardBuildMeta } from '@game-cms/base-core';

export async function writeDashboardMeta(
  dashboardPath: string,
  devMessagePort?: number
) {
  const meta: DashboardBuildMeta = {
    basePath: process.cwd(),
    devMessagePort,
  };

  await fsp.writeFile(
    path.join(dashboardPath, '.game-cms', 'meta.json'),
    JSON.stringify(meta),
    'utf8'
  );
}
