import { cms, setCmsController } from '@game-cms/global';
import { createController, initEnvFromConfigs } from '@game-cms/ignition';

import { executeRemainingMigrations } from '../../services/migration.js';

export default async function runMigrations() {
  await initEnvFromConfigs();
  setCmsController(createController());

  await executeRemainingMigrations();

  await cms().service('base::database').close();
}
