import path from 'node:path';

import { apiConfig, serviceSource } from '@game-cms/base-api';
import type {
  OwnEnvironment,
  OwnPluginClientConfig,
} from '@game-cms/base-core';
import type { Plugin } from '@game-cms/core';
import {
  resolveImportDirectory,
  resolveImportFile,
} from '@game-cms/shared/node';

import { clientConfigPlugin } from './clientConfig/vitePlugin.js';
import { resolveEntityEnvConfig } from './entity/resolver.js';
import { dashboardEntityPlugin } from './entity/vitePlugin.js';

export const basePlugin: Plugin<{
  env: OwnEnvironment;
  clientConfig: OwnPluginClientConfig;
}> = {
  id: 'base',
  config: {
    api: apiConfig,
    dashboard: {
      vite: {
        plugins: [dashboardEntityPlugin(), clientConfigPlugin()],
      },
    },
  },
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
    entity: resolveEntityEnvConfig,
  },
  clientConfigResolver: {
    filePath: resolveImportFile(
      import.meta,
      './clientConfig/ownResolver.client.js'
    ),
  },
};
