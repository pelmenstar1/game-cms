import path from 'node:path';

import { ApiErrorCode } from '@game-cms/base-core';
import type { PluginApiConfig, ServiceSource } from '@game-cms/core';
import { UnknownApiRoute } from '@game-cms/core/api';
import { combineAsyncFactories } from '@game-cms/shared';

import { errorStatuses } from './errors.js';
import { initAuth } from './plugins/auth.js';
import { scanDirectorySource } from './scan.js';
import * as services from './services/index.js';
import { errorHandler } from './utils/errorHandler.js';

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

      app.setErrorHandler(errorHandler());

      app.route({
        url: '/*',
        method: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        handler: (_req, res) => {
          const code: ApiErrorCode = 'base::route/notFound';

          res
            .status(404)
            .send({ error: { message: 'API route is not found', code } });
        },
      });
    },
  },
};
