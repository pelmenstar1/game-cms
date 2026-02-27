import { cms } from '@game-cms/global';
import { initCmsController, initEnvFromConfigs } from '@game-cms/ignition';

import { executeRemainingMigrations } from '../../services/migration.js';

export default async function runMigrations() {
  await initEnvFromConfigs();
  initCmsController();

  await executeRemainingMigrations();

  await cms().service('base::database').close();
}
