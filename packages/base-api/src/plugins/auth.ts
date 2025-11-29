import { type ApiRouteContextConfig } from '@game-cms/types';
import { ApiError, ApiErrorCode } from '@game-cms/utils';
import type { FastifyPluginCallback, RouteGenericInterface } from 'fastify';

import { getRequestJwt, type JwtSourceOptions } from '../utils/jwtSource.js';
import { hydrateRouteId } from '../utils/routeId.js';

export const auth: FastifyPluginCallback = (instance) => {
  instance.addHook<RouteGenericInterface, ApiRouteContextConfig>(
    'preHandler',
    async (req) => {
      const { id } = req.routeOptions.config;

      // If a route has id, it means it's protected.
      if (id !== undefined) {
        const jwtOptions: JwtSourceOptions = {
          cookieName: cms.service('base::auth').SESSION_JWT_TOKEN_COOKIE_NAME,
        };

        const token = getRequestJwt(req, jwtOptions);
        if (token === undefined) {
          throw new ApiError('No JWT', ApiErrorCode.UNAUTHORIZED);
        }

        const hydratedId = hydrateRouteId(id, req.params);

        await cms.service('base::auth').verifyJwt(token, hydratedId);
      }
    }
  );
};
