import { apiConfig, serviceSource } from '@game-cms/base-api';
import type { OwnEnvironment } from '@game-cms/base-types';
import { getImportDirectory } from '@game-cms/shared/node';
import type { Plugin } from '@game-cms/types';

import { scanEntitySchemas } from './entity.js';

export const basePlugin: Plugin<OwnEnvironment> = {
  api: apiConfig,
  services: serviceSource,
  components: () => ({
    distributionPath: getImportDirectory(
      import.meta.resolve('@game-cms/base-components')
    ),
  }),
  setup: async (config) => {
    await config.storage.provider.init?.();
  },
  env: {
    entitySchemas: scanEntitySchemas,
  },
};
