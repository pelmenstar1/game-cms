import type { Server } from 'node:http';
import path from 'node:path';

import { env, initializeEnv } from '@game-cms/env';
import { loadEnvIfExists } from '@game-cms/shared';
import { createRequestHandler } from '@react-router/express';
import chalk from 'chalk';
import express, { type Application } from 'express';
import httpProxy from 'http-proxy';

import { statusInline } from '../../utils/log.js';
import { setupApiFromConfig } from './api.js';
import { scanAllComponents } from './components.js';
import { resolveConfigInitMap } from './config.js';
import { getDashboardPackagePath, importDashboardBuild } from './dashboard.js';
import { getSharedAssetsConfig } from './sharedAssets.js';

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

function initProxyDashboard(app: Application, server: Server, url: string) {
  const proxy = httpProxy.createProxyServer({
    target: url,
    ws: true,
    proxyTimeout: 0,
    timeout: 0,
  });

  app.all('/{*splat}', (req, res) => {
    proxy.web(req, res);
  });

  server.on('upgrade', (req, socket, head) => {
    proxy.ws(req, socket, head);
  });
}

async function initDashboard(
  app: Application,
  server: Server,
  options: StartOptions
) {
  if (options.dashboard !== undefined) {
    initProxyDashboard(app, server, options.dashboard);
  } else {
    await initLocalDashboard(app);
  }
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

  await initDashboard(app, server, options);
}

export default async function start(options: StartOptions) {
  statusInline('Loading configs');
  await initEnvFromConfigs();

  statusInline('Server starting...');
  await startServer(options);
}
