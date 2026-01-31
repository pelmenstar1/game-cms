import { apiRoute } from '@game-cms/core/api';
import { cms } from '@game-cms/global';
import { stringObjectId } from '@game-cms/shared/mongo';
import { ObjectId } from 'mongodb';
import z from 'zod';

export default apiRoute({
  url: '/entity/:entityId/:entityObjectId/check/:checkId/:actionId',
  method: 'POST',
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

    await invokeAction({
      actionId,
      entityId,
      entityObjectId,
      actionPayload,
      id: checkId,
      actorId: new ObjectId(),
    });
  },
});
