import path from 'node:path';

import staticPlugin from '@fastify/static';
import { getImportDirectory } from '@game-cms/shared/node';
import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import httpProxy from 'http-proxy';

import type { StartOptions } from '../commands/start/types.js';

export function getDashboardBuildPath() {
  return getImportDirectory(import.meta.resolve('@game-cms/dashboard'));
}

export function getDashboardPackagePath() {
  return getImportDirectory(import.meta.resolve('@game-cms/dashboard/config'));
}

async function initLocalDashboard(app: FastifyInstance) {
  const dashboardPath = getDashboardBuildPath();

  await staticPlugin(app, { root: dashboardPath, wildcard: false });

  app.get('/*', (_req, res) => {
    res.sendFile(path.join(dashboardPath, 'index.html'));
  });
}

function initProxyDashboard(app: FastifyInstance, url: string) {
  const proxy = httpProxy.createProxyServer({
    target: url,
    ws: true,
    proxyTimeout: 0,
    timeout: 0,
  });

  app.all('/*', (req, res) => {
    proxy.web(req.raw, res.raw);
  });

  app.server.on('upgrade', (req, socket, head) => {
    proxy.ws(req, socket, head);
  });
}

export const dashboardPlugin: FastifyPluginAsync<StartOptions> = async (
  app,
  options
) => {
  if (options.dashboard !== undefined) {
    initProxyDashboard(app, options.dashboard);
  } else {
    await initLocalDashboard(app);
  }
};
