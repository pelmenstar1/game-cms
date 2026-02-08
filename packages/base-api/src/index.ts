import path from 'node:path';

import multipart from '@fastify/multipart';
import type { PluginApiConfig, ServiceSource } from '@game-cms/core';
import { UnknownApiRoute } from '@game-cms/core/api';
import { combineAsyncFactories } from '@game-cms/shared';

import { errorStatuses } from './errors.js';
import { abortablePlugin } from './plugins/abortable.js';
import { initAuth } from './plugins/auth.js';
import { scanDirectorySource } from './scan.js';
import * as services from './services/index.js';
import { errorHandler, ErrorResponseBody } from './utils/errorHandler.js';

export const serviceSource: ServiceSource = Object.values(services);

export const apiConfig: PluginApiConfig = {
  error: {
    statuses: errorStatuses,
  },
  routes: {
    urlPrefix: '/api',
    source: combineAsyncFactories(
      scanDirectorySource(path.join(import.meta.dirname, '../dist/routes')),
      ({ config }) => config.storage.provider.routes ?? [],
      ({ config }) =>
        config.entity?.checks?.flatMap(
          (check) => check.routes as UnknownApiRoute[]
        ) ?? []
    ),
  },
  fastify: {
    setup: (app) => {
      initAuth(app);

      app.register(multipart);
      app.register(abortablePlugin);
      app.setErrorHandler(errorHandler());

      app.route({
        url: '/*',
        method: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        handler: (_req, res) => {
          const body: ErrorResponseBody = {
            message: 'API route is not found',
            code: 'base::route/notFound',
          };

          res.status(404).send({ error: body });
        },
      });
    },
  },
};
