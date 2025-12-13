import multipart from '@fastify/multipart';
import { env, setCmsController } from '@game-cms/global';
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
    api: { routes },
    services,
  } = env();

  const app = createFastifyApp();

  app.register(dashboard, options);
  app.register(multipart);

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  for (const route of routes) {
    const url = route.config?.exact ? route.url : `/api${route.url}`;

    app.route({ ...route, url });
  }

  await initPlugins(app);

  // eslint-disable-next-line @typescript-eslint/await-thenable
  await Promise.all(services.map((service) => service.init?.()));

  await app.listen({ port: server.port });
}

export default async function start(options: StartOptions) {
  await initEnvFromConfigs();

  // Must be after initializing env as the controller needs env.
  setCmsController(createController());

  await startServer(options);
}
