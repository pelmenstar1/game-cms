import { initEnvFromConfigs } from '@game-cms/ignition';

import { startServer, StartServerOptions } from '../../services/server.js';

export default async function start(options: StartServerOptions) {
  await initEnvFromConfigs();
  await startServer(options);
}
