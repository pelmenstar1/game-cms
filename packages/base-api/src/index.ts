import path from 'node:path';

import { combineAsyncFactories } from '@game-cms/shared';
import type { PluginApiConfig, ServiceSource } from '@game-cms/types';
import { scanDirectorySource } from '@game-cms/utils';

import { auth } from './plugins/auth.js';
import * as services from './services/index.js';
import { errorHandler } from './utils/errorHandler.js';

export const serviceSource: ServiceSource = Object.values(services);

export const apiConfig: PluginApiConfig = {
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
