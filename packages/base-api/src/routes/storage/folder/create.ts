import { CreateFolderResponse } from '@game-cms/base-core';
import { createFolderPayload } from '@game-cms/base-core/schema';
import { apiRoute } from '@game-cms/core/api';
import { cms } from '@game-cms/global';

export default apiRoute({
  url: '/storage/folder',
  method: 'POST',
  config: {
    id: 'storage/folder$create',
  },
  schema: {
    body: createFolderPayload,
  },
  handler: async (req): Promise<CreateFolderResponse> => {
    const id = await cms().service('base::storage').createFolder(req.body);

    return { id };
  },
});
