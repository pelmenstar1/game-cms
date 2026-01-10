import fsp from 'node:fs/promises';
import path from 'node:path';

import type { DashboardMeta } from '@game-cms/core';

export async function writeDashboardMeta(
  dashboardPath: string,
  devMessagePort?: number
) {
  const meta: DashboardMeta = {
    basePath: process.cwd(),
    devMessagePort,
  };

  await fsp.writeFile(
    path.join(dashboardPath, '.game-cms', 'meta.json'),
    JSON.stringify(meta),
    'utf8'
  );
}
