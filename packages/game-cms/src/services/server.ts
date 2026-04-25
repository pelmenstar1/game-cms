import '@game-cms/core';

import { ApiRoute } from '@game-cms/core/api';
import { env, setLogger } from '@game-cms/global';
import { destroyServices, initServices } from '@game-cms/ignition';
import { onShutdown } from '@game-cms/shared/node';
import fastify, { FastifyPluginAsync, RawServerDefault } from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { Logger } from 'pino';

import {
  dashboardPlugin,
  type DashboardPluginOptions,
} from './dashboard/index.js';
import { createLogger } from './logger.js';
import { initPlugins } from './plugin.js';

const apiPlugin: FastifyPluginAsync<
  { routes: ApiRoute[] },
  RawServerDefault,
  ZodTypeProvider,
  Logger
> = async (app, { routes }) => {
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await initPlugins(app);

  for (const route of routes) {
    app.route(route);
  }
};

export interface StartServerOptions extends DashboardPluginOptions {
  port?: number;
}

export async function startServer(options: StartServerOptions = {}) {
  const {
    config: { server },
    api: { routes },
  } = env();

  const log = createLogger();
  const app = fastify({ loggerInstance: log });

  setLogger(log);

  await app.register(apiPlugin, { routes, prefix: '/api' });
  await app.register(dashboardPlugin, options);

  await initServices();

  app.addHook('onClose', async () => {
    log.info('Gracefully shutting down server');
    await destroyServices();
  });

  onShutdown(() => {
    void app.close();
  });

  await app.listen({ port: options.port ?? server.port });
}
