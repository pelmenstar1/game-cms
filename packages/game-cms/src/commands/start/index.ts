import { env, initializeEnv } from '@game-cms/env';
import path from 'node:path';
import express from 'express';
import { loadEnvIfExists } from '@game-cms/shared';
import { createRequestHandler } from '@react-router/express';
import type { ServerBuild } from 'react-router';
import { statusInline } from '../../utils/log.js';
import chalk from 'chalk';
import { resolveConfigInitMap } from './config.js';
import { setupApiFromConfig } from './api.js';
import { scanAllComponents } from './components.js';
import { getDashboardPackagePath, importDashboardBuild } from './dashboard.js';
import { getSharedAssetsConfig } from './sharedAssets.js';

async function initEnvFromConfigs() {
  await loadEnvIfExists();

  const [configMap, components, sharedAssets] = await Promise.all([
    resolveConfigInitMap(),
    scanAllComponents(),
    getSharedAssetsConfig(),
  ]);

  initializeEnv({
    config: configMap,
    components,
    sharedAssets,
  });
}

async function startServer(dashboardPath: string, dashboardBuild: ServerBuild) {
  const app = express();
  app.disable('x-powered-by');

  await setupApiFromConfig(app);

  app.use(
    dashboardBuild.publicPath,
    express.static(
      path.join(dashboardPath, dashboardBuild.assetsBuildDirectory)
    )
  );

  app.use(
    '/{*splat}',
    createRequestHandler({
      build: dashboardBuild,
      mode: 'production',
    })
  );

  const { port } = env().config.server;

  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    statusInline(
      `Server started at ${chalk.magentaBright(`http://localhost:${port}`)}`
    );
  });
}

export default async function start() {
  statusInline('Importing dashboard');
  const dashboardPath = getDashboardPackagePath();
  const dashboardBuild = await importDashboardBuild();

  statusInline('Loading configs');
  await initEnvFromConfigs();

  statusInline('Server starting...');
  await startServer(dashboardPath, dashboardBuild);
}
