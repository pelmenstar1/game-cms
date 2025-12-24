import { setCmsController } from '@game-cms/global';

import { createController } from '../../services/controller.js';
import { startServer } from '../../services/server.js';
import { initEnvFromConfigs } from './env.js';
import type { StartOptions } from './types.js';

export default async function start(options: StartOptions) {
  await initEnvFromConfigs();

  // Must be after initializing env as the controller needs env.
  setCmsController(createController());

  await startServer(options);
}
