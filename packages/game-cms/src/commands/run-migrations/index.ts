import { cms } from '@game-cms/global';
import { initEnvFromConfigs } from '@game-cms/ignition';

import { executeRemainingMigrations } from '../../services/migration.js';

export default async function runMigrations() {
  await initEnvFromConfigs();

  await executeRemainingMigrations();

  await cms().service('base::database').close();
}
