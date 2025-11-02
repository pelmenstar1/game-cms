import type { ApiRoute, GameCmsController, Service } from '@game-cms/types';
import type { Application, RequestHandler } from 'express';

import { createController } from './controller.js';
import { validateRouteInput } from './utils/requestValidator.js';

type ApiConfig = {
  routes: ApiRoute[];
  services: Service[];
};

function createRouteHandler(route: ApiRoute): RequestHandler {
  return (req, res, next) => {
    if (req.method === route.method) {
      if (validateRouteInput(route, req, res)) {
        return route.handler(req, res, next);
      }

      return;
    }

    next();
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
}
