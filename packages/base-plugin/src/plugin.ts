import path from 'node:path';

import { apiConfig, serviceSource } from '@game-cms/base-api';
import { routes } from '@game-cms/base-components/routes';
import {
  getEntityCheckItems,
  type OwnEnvironment,
  type OwnPluginClientConfig,
} from '@game-cms/base-core';
import type { Plugin } from '@game-cms/core';
import { filterOutNullable } from '@game-cms/shared/collections';
import { resolveImportDirectory } from '@game-cms/shared/node';

import { clientConfigPlugin } from './clientConfig/vitePlugin.js';
import { resolveEntityEnvConfig } from './entity/resolver.js';
import { dashboardEntityPlugin } from './entity/vitePlugin.js';
import { entityCheckPlugin } from './entityCheck/vitePlugin.js';

export const basePlugin: Plugin<{
  env: OwnEnvironment;
  clientConfig: OwnPluginClientConfig;
}> = {
  id: 'base',
  config: {
    api: apiConfig,
    dashboard: {
      vite: {
        plugins: [
          dashboardEntityPlugin(),
          clientConfigPlugin(),
          entityCheckPlugin(),
        ],
      },
      routes: (config) =>
        filterOutNullable(
          [
            ...routes,
            getEntityCheckItems(config.entity).map(
              (check) => check.dashboard?.routes
            ),
          ].flat(2)
        ),
    },
    client: {
      filePath: path.join(import.meta.dirname, './config.client.js'),
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
  env: {
    entity: resolveEntityEnvConfig,
  },
  clientConfigResolver: {
    filePath: path.join(
      import.meta.dirname,
      './clientConfig/ownResolver.client.js'
    ),
  },
  clientConfigSource: (config) => {
    const result = getEntityCheckItems(config.entity).map(
      (check) => check.clientConfig
    );

    return filterOutNullable(result);
  },
};
