import { cms, setCmsController } from '@game-cms/global';
import {
  initEnvFromConfigs,
  createController,
  initServices,
} from '@game-cms/ignition';
import { beforeAll } from 'vitest';

beforeAll(async () => {
  await initEnvFromConfigs(import.meta.dirname);
  setCmsController(createController());

  await initServices();
});
