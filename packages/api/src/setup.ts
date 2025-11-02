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

export function setupApi(
  app: FastifyInstance,
  { routes, services }: ApiConfig
) {
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  setCms(createController(services));
  app.addHook('onError', errorHandler());

  for (const route of routes) {
    const prefix = route.exact ? route.url : `/api${route.url}`;

    app.route({ ...route, url: prefix });
  }
}
