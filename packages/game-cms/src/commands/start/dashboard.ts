import type { ServerBuild } from 'react-router';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export async function importDashboardBuild() {
  return (await import('@game-cms/dashboard')) as unknown as ServerBuild;
}

export function getDashboardPackagePath() {
  const dashboardImportUrl = import.meta.resolve('@game-cms/dashboard');

  return path.join(path.dirname(fileURLToPath(dashboardImportUrl)), '../../');
}
