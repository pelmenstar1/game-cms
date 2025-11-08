import { objectId } from '@game-cms/shared/mongo';
import { apiRoute } from '@game-cms/shared-api';
import { getFolderResponse } from '@game-cms/types';
import z from 'zod';

import { authHandler } from '../../../middlewares/auth.js';

export default apiRoute({
  url: '/folder/byId/:folderId',
  method: 'GET',
  config: {
    id: 'folder$get',
  },
  schema: {
    params: z.object({
      folderId: objectId,
    }),
    response: {
      200: getFolderResponse,
    },
  },
  preHandler: [authHandler()],
  handler: async (req, res) => {
    const { folderId } = req.params;

    const result = await cms.service('base::folder').getById(folderId);
    if (result === null) {
      res.callNotFound();
      return;
    }

    return result;
  },
});
