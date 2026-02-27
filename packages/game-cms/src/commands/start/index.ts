import { initCmsController, initEnvFromConfigs } from '@game-cms/ignition';

import type { DashboardPluginOptions } from '../../services/dashboard/index.js';
import { startServer } from '../../services/server.js';

export default async function start(options: DashboardPluginOptions) {
  await initEnvFromConfigs();

  // Must be after initializing env as the controller needs env.
  initCmsController();

  await startServer(options);
}
