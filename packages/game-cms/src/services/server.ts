import { ApiRoute } from '@game-cms/core/api';
import { env, setLogger } from '@game-cms/global';
import { initServices } from '@game-cms/ignition';
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

  for (const route of routes) {
    app.route(route);
  }

  await initPlugins(app);
};

export async function startServer(options: DashboardPluginOptions = {}) {
  const {
    config: { server },
    api: { routes },
  } = env();

  const app = fastify({ loggerInstance: createLogger() });

  setLogger(app.log);

  await app.register(apiPlugin, { routes, prefix: '/api' });
  await app.register(dashboardPlugin, options);

  await initServices();

  await app.listen({ port: server.port });
}
