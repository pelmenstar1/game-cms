import { isPromise } from 'node:util/types';

import multipart from '@fastify/multipart';
import { env } from '@game-cms/env';
import type { GameCmsController, Service } from '@game-cms/types';
import type { FastifyInstance } from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';

import { createController } from './controller.js';
import { errorHandler } from './utils/errorHandler.js';

function setCms(value: GameCmsController) {
  (globalThis as unknown as { cms: GameCmsController }).cms = value;
}

async function setupServices(services: Service[]) {
  const jobs = services.map((service) => service.init?.());

  await Promise.all(jobs.filter((job) => isPromise(job)));

  console.log('[api] Services initialized');
}

export async function setupApi(app: FastifyInstance) {
  const { apiRoutes, services } = env();

  setCms(createController(services));

  app.register(multipart);
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.setErrorHandler(errorHandler());

  await setupServices(services);

  for (const route of apiRoutes) {
    const prefix = route.config?.exact ? route.url : `/api${route.url}`;

    app.route({ ...route, url: prefix });
  }
}
