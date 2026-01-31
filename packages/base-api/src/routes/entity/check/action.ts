import { ApiError } from '@game-cms/base-core';
import { apiRoute } from '@game-cms/core/api';
import { cms } from '@game-cms/global';
import { stringObjectId } from '@game-cms/shared/mongo';
import { ObjectId } from 'mongodb';
import z from 'zod';

import { SESSION_JWT_COOKIE_NAME } from '../../../utils/authCookie.js';
import { getRequestJwt, JwtSourceOptions } from '../../../utils/jwtSource.js';

const jwtOptions: JwtSourceOptions = {
  cookieName: SESSION_JWT_COOKIE_NAME,
};

export default apiRoute({
  url: '/entity/:entityId/:entityObjectId/check/:checkId/:actionId',
  method: 'POST',
  config: {
    id: () => {
      const checks = cms().service('base::entityCheck').getAll();

      return checks.flatMap((check) =>
        Object.keys(check.actions).map(
          (actionId) => `entityCheck/${check.id}$${actionId}` as const
        )
      );
    },
  },
  schema: {
    params: z.object({
      entityId: z.string(),
      entityObjectId: stringObjectId,
      checkId: z.string(),
      actionId: z.string(),
    }),
  },
  handler: async (req) => {
    const { entityId, entityObjectId, checkId, actionId } = req.params;
    const rawPayload = req.body;

    const { validateActionPayload, invokeAction } =
      cms().service('base::entityCheck');

    const actionPayload = validateActionPayload<string, string>(
      checkId,
      actionId,
      rawPayload
    );

    const token = getRequestJwt(req, jwtOptions);
    if (token === undefined) {
      throw new ApiError('No JWT', 'base::access/expired');
    }

    const { actorId } = await cms()
      .service('base::auth')
      .verifySessionJwt(token, `entityCheck/${checkId}$${actionId}`);

    await invokeAction({
      actionId,
      entityId,
      entityObjectId,
      actionPayload,
      id: checkId,
      actorId: new ObjectId(actorId),
    });
  },
});
