import { apiRoute } from '@game-cms/shared-api';
import { createFolderPayload, createFolderResponse } from '@game-cms/types';

import { authHandler } from '../../middlewares/auth.js';

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
  preHandler: [authHandler()],
  handler: async (req) => {
    const { id } = await cms.service('base::folder').create(req.body);

    return { id };
  },
});
