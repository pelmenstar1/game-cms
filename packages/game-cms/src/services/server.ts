import multipart from '@fastify/multipart';
import { env, setLogger } from '@game-cms/global';
import { initServices } from '@game-cms/ignition';
import fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';

import {
  dashboardPlugin,
  type DashboardPluginOptions,
} from './dashboard/index.js';
import { createLogger } from './logger.js';
import { initPlugins } from './plugin.js';

export async function startServer(options: DashboardPluginOptions = {}) {
  const {
    config: { server },
    api: { routes },
  } = env();

  const app = fastify({ loggerInstance: createLogger() });

  setLogger(app.log);

  app.register(dashboardPlugin, options);
  app.register(multipart);

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  for (const route of routes) {
    const url = route.config?.exact ? route.url : `/api${route.url}`;

    app.route({ ...route, url });
  }

  await initPlugins(app);
  await initServices();

  await app.listen({ port: server.port });
}
