import { updateFolderPayload } from '@game-cms/base-types';
import { objectId } from '@game-cms/shared/mongo';
import { apiRoute } from '@game-cms/utils';
import z from 'zod';

export default apiRoute({
  url: '/folder/byId/:folderId',
  method: 'PUT',
  config: {
    id: 'folder$update',
  },
  schema: {
    params: z.object({
      folderId: objectId,
    }),
    body: updateFolderPayload,
  },
  handler: async (req) => {
    const { folderId } = req.params;
    const payload = req.body;

    await cms.service('base::folder').updateById(folderId, payload);
  },
});
