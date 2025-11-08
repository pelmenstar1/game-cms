import { setupApi } from '@game-cms/api';
import { type CmsEnvironment, env, initializeEnv } from '@game-cms/env';
import { loadEnvIfExists } from '@game-cms/shared';
import chalk from 'chalk';
import fastify from 'fastify';

import { statusInline } from '../../utils/log.js';
import { getAllServices, getApiRoutes } from './api.js';
import { scanAllComponents } from './components.js';
import { resolveConfig } from './config.js';
import { initDashboard } from './dashboard.js';
import { scanEntitySchemas } from './entity.js';
import { getSharedAssetsConfig } from './sharedAssets.js';
import { setupStorageProvider } from './storageProvider.js';
import type { StartOptions } from './types.js';

type EnvInitializers = {
  [K in Exclude<keyof CmsEnvironment, 'config'>]: (
    config: CmsEnvironment['config']
  ) => Promise<CmsEnvironment[K]>;
};

const envInitializers: EnvInitializers = {
  apiRoutes: getApiRoutes,
  components: scanAllComponents,
  entitySchemas: scanEntitySchemas,
  services: getAllServices,
  sharedAssets: getSharedAssetsConfig,
};

async function initEnvFromConfigs() {
  await loadEnvIfExists();

  const config = await resolveConfig();

  const envEntries = await Promise.all(
    Object.entries(envInitializers).map(
      async ([key, init]) => [key, await init(config)] as const
    )
  );

  const env = { ...Object.fromEntries(envEntries), config } as CmsEnvironment;

  initializeEnv(env);
}

async function startServer(options: StartOptions) {
  const app = fastify();

  await Promise.all([
    setupApi(app),
    initDashboard(app, options),
    setupStorageProvider(),
  ]);

  const { port } = env().config.server;

  app.listen({ port }, (error) => {
    if (error) {
      throw error;
    }

    statusInline(
      `Server started at ${chalk.magentaBright(`http://localhost:${port}`)}`
    );
  });
}

export default async function start(options: StartOptions) {
  statusInline('Loading configs');
  await initEnvFromConfigs();

  statusInline('Server starting...');
  await startServer(options);
}
