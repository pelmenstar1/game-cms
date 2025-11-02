import type { ApiRoute, GameCmsController, Service } from '@game-cms/types';
import type { Application, RequestHandler } from 'express';

import { createController } from './controller.js';
import { errorHandler } from './utils/errorHandler.js';
import { validateRouteInput } from './utils/requestValidator.js';

type ApiConfig = {
  routes: ApiRoute[];
  services: Service[];
};

function createRouteHandler(route: ApiRoute): RequestHandler {
  return (req, res, next) => {
    if (req.method === route.method) {
      validateRouteInput(route, req);

      return route.handler(req, res, next);
    } else {
      next();
    }
  };
}

function setCms(value: GameCmsController) {
  (globalThis as unknown as { cms: GameCmsController }).cms = value;
}

export function setupApi(app: Application, { routes, services }: ApiConfig) {
  setCms(createController(services));

  for (const route of routes) {
    const prefix = route.exact ? route.path : `/api${route.path}`;

    app.route(prefix).all(createRouteHandler(route));
  }

  // Error handler should always be in the end.
  app.use(errorHandler());
}
