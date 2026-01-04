import multipart from '@fastify/multipart';
import { env } from '@game-cms/global';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';

import {
  dashboardPlugin,
  type DashboardPluginOptions,
} from './dashboard/index.js';
import { createFastifyApp } from './fastify.js';
import { initPlugins } from './plugin.js';

export async function startServer(options: DashboardPluginOptions = {}) {
  const {
    config: { server },
    api: { routes },
    services,
  } = env();

  const app = createFastifyApp();

  app.register(dashboardPlugin, options);
  app.register(multipart);

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  for (const route of routes) {
    const url = route.config?.exact ? route.url : `/api${route.url}`;

    app.route({ ...route, url });
  }

  await initPlugins(app);

  await Promise.all(services.map((service) => service.init?.()));

  await app.listen({ port: server.port });
}
