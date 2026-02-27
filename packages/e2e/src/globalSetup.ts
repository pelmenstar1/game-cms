import path from 'node:path';

import {
  initCmsController,
  initEnvFromConfigs,
  initServices,
} from '@game-cms/ignition';
import { beforeAll } from 'vitest';

beforeAll(async () => {
  await initEnvFromConfigs(path.join(import.meta.dirname, '../'));
  initCmsController();

  await initServices();
});
