import { getFolderResponse } from '@game-cms/base-types';
import { objectId } from '@game-cms/shared/mongo';
import { apiRoute } from '@game-cms/utils';
import z from 'zod';

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
