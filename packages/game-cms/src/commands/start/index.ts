import { setCmsController } from '@game-cms/global';
import { createController, initEnvFromConfigs } from '@game-cms/ignition';

import type { DashboardPluginOptions } from '../../services/dashboard/index.js';
import { startServer } from '../../services/server.js';

export default async function start(options: DashboardPluginOptions) {
  await initEnvFromConfigs();

  // Must be after initializing env as the controller needs env.
  setCmsController(createController());

  await startServer(options);
}
