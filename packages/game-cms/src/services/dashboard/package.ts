import path from 'node:path';

import { resolveImportDirectory } from '@game-cms/shared/node';

export function getDashboardPackagePath() {
  return resolveImportDirectory(
    import.meta,
    '@game-cms/dashboard/package.json'
  );
}

export function getLocalDashboardBuildPath() {
  return path.resolve('./build');
}
