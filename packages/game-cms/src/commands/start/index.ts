import { env, initializeEnv } from '@game-cms/env';
import { loadEnvIfExists } from '@game-cms/shared';
import chalk from 'chalk';
import express from 'express';

import { statusInline } from '../../utils/log.js';
import { setupApiFromConfig } from './api.js';
import { scanAllComponents } from './components.js';
import { resolveConfigInitMap } from './config.js';
import { initDashboard } from './dashboard.js';
import { getSharedAssetsConfig } from './sharedAssets.js';
import type { StartOptions } from './types.js';

async function initEnvFromConfigs() {
  await loadEnvIfExists();

  const [config, components, sharedAssets] = await Promise.all([
    resolveConfigInitMap(),
    scanAllComponents(),
    getSharedAssetsConfig(),
  ]);

  initializeEnv({ config, components, sharedAssets });
}

async function startServer(options: StartOptions) {
  const app = express();
  app.disable('x-powered-by');

  await setupApiFromConfig(app);

  const { port } = env().config.server;

  const server = app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    statusInline(
      `Server started at ${chalk.magentaBright(`http://localhost:${port}`)}`
    );
  });

  initDashboard(app, server, options);
}

export default async function start(options: StartOptions) {
  statusInline('Loading configs');
  await initEnvFromConfigs();

  statusInline('Server starting...');
  await startServer(options);
}
