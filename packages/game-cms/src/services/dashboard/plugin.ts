import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

import httpProxy from '@fastify/http-proxy';
import staticPlugin from '@fastify/static';
import type { FastifyInstance, FastifyPluginAsync } from 'fastify';

import { getLocalDashboardBuildPath } from './package.js';

async function initLocalIndexFile(app: FastifyInstance, dashboardPath: string) {
  const content = await fsp.readFile(path.join(dashboardPath, 'index.html'));

  app.get('/*', (_req, res) => {
    res.header('content-type', 'text/html');

    return content;
  });
}

async function initLocalDashboard(app: FastifyInstance) {
  const dashboardPath = getLocalDashboardBuildPath();

  if (!fs.existsSync(dashboardPath)) {
    throw new Error('Dashboard build does not exist');
  }

  await staticPlugin(app, { root: dashboardPath, wildcard: false });
  await initLocalIndexFile(app, dashboardPath);
}

function initProxyDashboard(app: FastifyInstance, url: string) {
  app.register(httpProxy, {
    upstream: url,
    websocket: true,
    disableRequestLogging: true,
  });
}

export type DashboardPluginOptions = { dashboard?: string };

export const dashboardPlugin: FastifyPluginAsync<
  DashboardPluginOptions
> = async (app, options) => {
  if (options.dashboard !== undefined) {
    initProxyDashboard(app, options.dashboard);
  } else {
    await initLocalDashboard(app);
  }
};
