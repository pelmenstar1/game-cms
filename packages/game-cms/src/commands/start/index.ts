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
  const app = createFastifyApp();

  app.register(dashboard, options);
  app.register(multipart);

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await initPlugins(app);

  setCmsController(createController());

  const { port } = env().config.server;

  await app.listen({ port });
}

export default async function start(options: StartOptions) {
  await initEnvFromConfigs();
  await startServer(options);
}
