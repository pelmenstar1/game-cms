import { getFolderResponse } from '@game-cms/base-types';
import { objectId } from '@game-cms/shared/mongo';
import { ApiError, apiRoute } from '@game-cms/utils';
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
  handler: async (req) => {
    const { folderId } = req.params;

    const result = await cms.service('base::folder').getById(folderId);
    if (result === null) {
      throw new ApiError(`Folder not found`, 'base::entity/notFound');
    }

    return result;
  },
});
