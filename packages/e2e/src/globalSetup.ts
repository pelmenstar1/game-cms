import path from 'node:path';

import { setCmsController } from '@game-cms/global';
import {
  createController,
  initEnvFromConfigs,
  initServices,
} from '@game-cms/ignition';
import { beforeAll } from 'vitest';

beforeAll(async () => {
  await initEnvFromConfigs(path.join(import.meta.dirname, '../'));
  setCmsController(createController());

  await initServices();
});
