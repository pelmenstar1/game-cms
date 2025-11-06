import { isPromise } from 'node:util/types';

import type { ApiRoute, GameCmsController, Service } from '@game-cms/types';
import type { FastifyInstance } from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';

import { createController } from './controller.js';
import { errorHandler } from './utils/errorHandler.js';

type ApiConfig = {
  routes: ApiRoute[];
  services: Service[];
};

function setCms(value: GameCmsController) {
  (globalThis as unknown as { cms: GameCmsController }).cms = value;
}

async function setupServices(services: Service[]) {
  const jobs = services.map((service) => service.init?.());

  await Promise.all(jobs.filter((job) => isPromise(job)));

  console.log('[api] Services initialized');
}

export async function setupApi(
  app: FastifyInstance,
  { routes, services }: ApiConfig
) {
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  setCms(createController(services));

  app.setErrorHandler(errorHandler());

  await setupServices(services);

  for (const route of routes) {
    const prefix = route.exact ? route.url : `/api${route.url}`;

    app.route({ ...route, url: prefix });
  }
}
