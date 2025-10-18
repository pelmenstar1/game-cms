import path from 'node:path';

import { env, initializeEnv } from '@game-cms/env';
import { loadEnvIfExists } from '@game-cms/shared';
import { createRequestHandler } from '@react-router/express';
import chalk from 'chalk';
import express, { type Application } from 'express';

import { statusInline } from '../../utils/log.js';
import { setupApiFromConfig } from './api.js';
import { scanAllComponents } from './components.js';
import { resolveConfigInitMap } from './config.js';
import { getDashboardPackagePath, importDashboardBuild } from './dashboard.js';
import { getSharedAssetsConfig } from './sharedAssets.js';

import { createProxyServer } from 'http-proxy';

type StartOptions = {
  dashboard?: string;
};

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

async function initLocalDashboard(app: Application) {
  const dashboardPath = getDashboardPackagePath();
  const dashboardBuild = await importDashboardBuild();

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
}

function initProxyDashboard(app: Application, url: string) {
  const proxy = createProxyServer({ target: url, changeOrigin: true });

  app.use('/{*splat}', (req, res) => {
    proxy.web(req, res);
  });
}

async function initDashboard(app: Application, options: StartOptions) {
  if (options.dashboard !== undefined) {
    initProxyDashboard(app, options.dashboard);
  } else {
    await initLocalDashboard(app);
  }
}

async function startServer(options: StartOptions) {
  const app = express();
  app.disable('x-powered-by');

  await setupApiFromConfig(app);
  await initDashboard(app, options);

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

export default async function start(options: StartOptions) {
  statusInline('Loading configs');
  await initEnvFromConfigs();

  statusInline('Server starting...');
  await startServer(options);
}
