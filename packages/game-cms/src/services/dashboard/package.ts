import fs from 'node:fs';
import path from 'node:path';

import { resolveImportDirectory } from '@game-cms/shared/node';

export function getDashboardPackagePath() {
  return resolveImportDirectory(
    import.meta,
    '@game-cms/dashboard/package.json'
  );
}

export function getLocalDashboardBuildPath() {
  const dashboardPath = path.resolve('./build');
  if (!fs.existsSync(dashboardPath)) {
    throw new Error('Dashboard build does not exist');
  }

  return dashboardPath;
}
