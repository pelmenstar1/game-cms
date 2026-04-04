import path from 'node:path';

import { createFileLock } from '@game-cms/shared/node';

import { dashboardInternalPath } from './constants.js';

export const LOCK_FILE_PATH = dashboardInternalPath('build.lock');

export function createDashboardBuildLock(dashboardPath: string) {
  return createFileLock(path.join(dashboardPath, LOCK_FILE_PATH));
}
