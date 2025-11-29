import { apiConfig, serviceSource } from '@game-cms/base-api';
import type { OwnEnvironment } from '@game-cms/base-types';
import type { Plugin } from '@game-cms/types';

import { scanEntitySchemas } from './entity.js';

export const basePlugin: Plugin<OwnEnvironment> = {
  api: apiConfig,
  services: serviceSource,
  setup: async (config) => {
    await config.storage.provider.init?.();
  },
  env: {
    entitySchemas: scanEntitySchemas,
  },
};
