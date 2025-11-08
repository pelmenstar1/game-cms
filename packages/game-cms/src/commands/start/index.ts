import { env, initializeEnv } from '@game-cms/env';
import { loadEnvIfExists } from '@game-cms/shared';
import chalk from 'chalk';
import fastify from 'fastify';

import { statusInline } from '../../utils/log.js';
import { setupApiFromConfig } from './api.js';
import { scanAllComponents } from './components.js';
import { resolveConfigInitMap } from './config.js';
import { initDashboard } from './dashboard.js';
import { scanEntitySchemas } from './entity.js';
import { getSharedAssetsConfig } from './sharedAssets.js';
import { setupStorageProvider } from './storageProvider.js';
import type { StartOptions } from './types.js';

async function initEnvFromConfigs() {
  await loadEnvIfExists();

  const [config, components, entitySchemas, sharedAssets] = await Promise.all([
    resolveConfigInitMap(),
    scanAllComponents(),
    scanEntitySchemas(),
    getSharedAssetsConfig(),
  ]);

  initializeEnv({ config, components, entitySchemas, sharedAssets });
}

async function startServer(options: StartOptions) {
  const app = fastify();

  await Promise.all([
    setupApiFromConfig(app),
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
