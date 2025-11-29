import {
  createFolderPayload,
  createFolderResponse,
} from '@game-cms/base-types';
import { apiRoute } from '@game-cms/utils';

export default apiRoute({
  url: '/folder',
  method: 'POST',
  config: {
    id: 'folder$create',
  },
  schema: {
    body: createFolderPayload,
    response: {
      200: createFolderResponse,
    },
  },
  handler: async (req) => {
    const { id } = await cms.service('base::folder').create(req.body);

    return { id };
  },
});
