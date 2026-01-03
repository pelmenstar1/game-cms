import path from 'node:path';

import type { PluginApiConfig, ServiceSource } from '@game-cms/core';
import { combineAsyncFactories } from '@game-cms/shared';

import { errorStatuses } from './errors.js';
import { auth } from './plugins/auth.js';
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
      ({ config }) => config.storage.provider.routes ?? []
    ),
  },
  fastify: {
    setup: (app) => {
      app.register(auth);
      app.setErrorHandler(errorHandler());
    },
  },
};
