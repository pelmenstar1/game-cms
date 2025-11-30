import multipart from '@fastify/multipart';
import { env } from '@game-cms/env';
import { setCmsController } from '@game-cms/utils';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';

import { createController } from './controller.js';
import { dashboard } from './dashboard.js';
import { initEnvFromConfigs } from './env.js';
import { createFastifyApp } from './fastify.js';
import { initPlugins } from './plugin.js';
import type { StartOptions } from './types.js';

async function startServer(options: StartOptions) {
  const {
    config: { server },
    apiRoutes,
  } = env();

  const app = createFastifyApp();

  app.register(dashboard, options);
  app.register(multipart);

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  for (const route of apiRoutes) {
    const url = route.config?.exact ? route.url : `/api${route.url}`;

    app.route({ ...route, url });
  }

  await initPlugins(app);

  setCmsController(createController());

  await app.listen({ port: server.port });
}

export default async function start(options: StartOptions) {
  await initEnvFromConfigs();
  await startServer(options);
}
