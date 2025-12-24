import { setCmsController } from '@game-cms/global';

import { createController } from '../../services/controller.js';
import type { DashboardPluginOptions } from '../../services/dashboard.js';
import { initEnvFromConfigs } from '../../services/env.js';
import { startServer } from '../../services/server.js';

export default async function start(options: DashboardPluginOptions) {
  await initEnvFromConfigs();

  // Must be after initializing env as the controller needs env.
  setCmsController(createController());

  await startServer(options);
}
