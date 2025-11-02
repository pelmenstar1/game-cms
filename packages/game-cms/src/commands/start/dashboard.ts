import path from 'node:path';
import { fileURLToPath } from 'node:url';

import staticPlugin from '@fastify/static';
import type { FastifyInstance } from 'fastify';
import httpProxy from 'http-proxy';

import type { StartOptions } from './types.js';

function getDashboardBuildPath() {
  const dashboardImportUrl = import.meta.resolve('@game-cms/dashboard');

  return path.dirname(fileURLToPath(dashboardImportUrl));
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

  app.all('/{*splat}', (req, res) => {
    proxy.web(req.raw, res.raw);
  });

  app.server.on('upgrade', (req, socket, head) => {
    proxy.ws(req, socket, head);
  });
}

export async function initDashboard(
  app: FastifyInstance,
  options: StartOptions
) {
  if (options.dashboard !== undefined) {
    initProxyDashboard(app, options.dashboard);
  } else {
    await initLocalDashboard(app);
  }
}
