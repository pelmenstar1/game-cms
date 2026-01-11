import path from 'node:path';

import { apiConfig, serviceSource } from '@game-cms/base-api';
import type { OwnEnvironment } from '@game-cms/base-core';
import type { Plugin } from '@game-cms/core';
import { getImportDirectory } from '@game-cms/shared/node';

import { scanEntitySchemas } from './entity/scan.js';
import { dashboardEntityPlugin } from './entity/vitePlugin.js';

export const basePlugin: Plugin<OwnEnvironment> = {
  id: 'base',
  api: apiConfig,
  services: serviceSource,
  components: () => {
    const rootDir = getImportDirectory(
      import.meta.resolve('@game-cms/base-components')
    );

    return {
      distributionPath: path.join(rootDir, 'components'),
    };
  },
  setup: async (config) => {
    await config.storage.provider.init?.();
  },
  env: {
    entities: scanEntitySchemas,
  },
  dashboard: {
    plugins: [dashboardEntityPlugin()],
  },
};
