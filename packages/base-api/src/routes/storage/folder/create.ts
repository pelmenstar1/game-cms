import {
  createFolderPayload,
  createFolderResponse,
} from '@game-cms/base-types/schema';
import { apiRoute } from '@game-cms/core';
import { cms } from '@game-cms/global';

export default apiRoute({
  url: '/storage/folder',
  method: 'POST',
  config: {
    id: 'storage/folder$create',
  },
  schema: {
    body: createFolderPayload,
    response: {
      200: createFolderResponse,
    },
  },
  handler: async (req) => {
    const id = await cms().service('base::storage').createFolder(req.body);

    return { id };
  },
});
