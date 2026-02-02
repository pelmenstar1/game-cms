import type {
  ApiRouteContextConfig,
  CmsFastifyInstance,
} from '@game-cms/core/api';
import { ApiError } from '@game-cms/core/api';
import { cms } from '@game-cms/global';
import { resolveMaybeFactory } from '@game-cms/shared';
import type { RouteGenericInterface } from 'fastify';

import { SESSION_JWT_COOKIE_NAME } from '../utils/authCookie.js';
import { getRequestJwt, type JwtSourceOptions } from '../utils/jwtSource.js';
import { hydrateRouteId } from '../utils/routeId.js';

const jwtOptions: JwtSourceOptions = {
  cookieName: SESSION_JWT_COOKIE_NAME,
};

export function initAuth(instance: CmsFastifyInstance) {
  instance.addHook<RouteGenericInterface, ApiRouteContextConfig>(
    'preHandler',
    async (req) => {
      const { id: idFactory } = req.routeOptions.config;

      // If a route has id, it means it's protected.
      if (idFactory !== undefined) {
        const id = resolveMaybeFactory(idFactory);
        if (typeof id !== 'string') {
          return;
        }

        const hydratedId = hydrateRouteId(id, req.params);

        const isPublic = await cms()
          .service('base::auth::public')
          .isPublicRoute(hydratedId);

        if (isPublic) {
          return;
        }

        const token = getRequestJwt(req, jwtOptions);
        if (token === undefined) {
          throw new ApiError('No JWT', 'base::access/expired');
        }

        const { actorId } = await cms()
          .service('base::auth')
          .verifySessionJwt(token, hydratedId);

        req.actorId = actorId;
      }
    }
  );
}
