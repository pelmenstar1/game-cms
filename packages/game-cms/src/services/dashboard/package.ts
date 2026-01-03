import fs from 'node:fs';
import path from 'node:path';

import { getImportDirectory } from '@game-cms/shared/node';

export function getDashboardPackagePath() {
  return getImportDirectory(
    import.meta.resolve('@game-cms/dashboard/package.json')
  );
}

export function getLocalDashboardBuildPath() {
  const dashboardPath = path.resolve('./build');
  if (!fs.existsSync(dashboardPath)) {
    throw new Error('Dashboard build does not exist');
  }

  return dashboardPath;
}
