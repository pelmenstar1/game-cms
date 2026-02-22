import path from 'node:path';

import { apiConfig, serviceSource } from '@game-cms/base-api';
import type { OwnEnvironment } from '@game-cms/base-core';
import type { Plugin } from '@game-cms/core';
import { resolveImportDirectory } from '@game-cms/shared/node';

import { resolveEntitySchemas } from './entity/resolver.js';
import { dashboardEntityPlugin } from './entity/vitePlugin.js';

export const basePlugin: Plugin<OwnEnvironment> = {
  id: 'base',
  api: apiConfig,
  services: serviceSource,
  components: () => {
    const rootDir = resolveImportDirectory(
      import.meta,
      '@game-cms/base-components'
    );

    return {
      distributionPath: path.join(rootDir, 'components'),
    };
  },
  setup: async (config) => {
    await config.storage.provider.init?.();
  },
  env: {
    entity: resolveEntitySchemas,
  },
  dashboard: {
    plugins: [dashboardEntityPlugin()],
  },
};
