import { initEnvFromConfigs } from '@game-cms/ignition';

import type { DashboardPluginOptions } from '../../services/dashboard/index.js';
import { startServer } from '../../services/server.js';

export default async function start(options: DashboardPluginOptions) {
  await initEnvFromConfigs();
  await startServer(options);
}
