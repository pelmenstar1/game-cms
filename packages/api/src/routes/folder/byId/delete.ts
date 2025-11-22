import { objectId } from '@game-cms/shared/mongo';
import { apiRoute } from '@game-cms/shared-api';
import { deleteFolderOptions } from '@game-cms/types';
import z from 'zod';

export default apiRoute({
  url: '/folder/byId/:folderId',
  method: 'DELETE',
  config: {
    id: 'folder$delete',
  },
  schema: {
    querystring: deleteFolderOptions,
    params: z.object({
      folderId: objectId,
    }),
  },
  handler: async (req) => {
    const { folderId } = req.params;

    await cms.service('base::folder').deleteById(folderId);
  },
});
