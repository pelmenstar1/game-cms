import '@game-cms/types';

import type { Application } from 'express';
import type { ApiRoute, GameCmsController, Service } from '@game-cms/types';
import { createController } from './controller.js';

type ApiConfig = {
  routes: ApiRoute[];
  services: Service[];
};

export function setupApi(app: Application, { routes, services }: ApiConfig) {
  (globalThis as unknown as { cms: GameCmsController }).cms =
    createController(services);

  for (const route of routes) {
    const prefix = route.exact ? route.path : `/api${route.path}`;

    app.route(prefix).all((req, res, next) => {
      if (req.method === route.method) {
        return route.handler(req, res, next);
      }

      next();
    });
  }
}
