import type { Server } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { Application } from 'express';
import express from 'express';
import httpProxy from 'http-proxy';

import type { StartOptions } from './types.js';

function getDashboardBuildPath() {
  const dashboardImportUrl = import.meta.resolve('@game-cms/dashboard');

  return path.dirname(fileURLToPath(dashboardImportUrl));
}

function initLocalDashboard(app: Application) {
  const dashboardPath = getDashboardBuildPath();

  app.use('/', express.static(dashboardPath));

  app.get('/{*splat}', (_req, res) => {
    res.sendFile(path.join(dashboardPath, 'index.html'));
  });
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

export function initDashboard(
  app: Application,
  server: Server,
  options: StartOptions
) {
  if (options.dashboard !== undefined) {
    initProxyDashboard(app, server, options.dashboard);
  } else {
    initLocalDashboard(app);
  }
}
