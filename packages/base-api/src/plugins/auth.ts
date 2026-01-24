import { ApiError } from '@game-cms/base-core';
import type {
  ApiRouteContextConfig,
  CmsFastifyInstance,
} from '@game-cms/core/api';
import { cms } from '@game-cms/global';
import type { RouteGenericInterface } from 'fastify';

import { SESSION_JWT_COOKIE_NAME } from '../utils/authCookie.js';
import { getRequestJwt, type JwtSourceOptions } from '../utils/jwtSource.js';
import { hydrateRouteId } from '../utils/routeId.js';

export function initAuth(instance: CmsFastifyInstance) {
  instance.addHook<RouteGenericInterface, ApiRouteContextConfig>(
    'preHandler',
    async (req) => {
      const { id } = req.routeOptions.config;

      // If a route has id, it means it's protected.
      if (id !== undefined) {
        const jwtOptions: JwtSourceOptions = {
          cookieName: SESSION_JWT_COOKIE_NAME,
        };

        const token = getRequestJwt(req, jwtOptions);
        if (token === undefined) {
          throw new ApiError('No JWT', 'base::access/expired');
        }

        const hydratedId = hydrateRouteId(id, req.params);

        await cms().service('base::auth').verifySessionJwt(token, hydratedId);
      }
    }
  );
}
