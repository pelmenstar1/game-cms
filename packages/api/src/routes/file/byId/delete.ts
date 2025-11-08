import { objectId } from '@game-cms/shared/mongo';
import { apiRoute } from '@game-cms/shared-api';
import { deleteFileOptions } from '@game-cms/types';
import z from 'zod';

import { authHandler } from '../../../middlewares/auth.js';

export default apiRoute({
  url: '/file/byId/:fileId',
  method: 'DELETE',
  config: {
    id: 'file$delete',
  },
  schema: {
    params: z.object({
      fileId: objectId,
    }),
    querystring: deleteFileOptions,
  },
  preHandler: [authHandler()],
  handler: async (req) => {
    const { fileId } = req.params;
    const options = req.query;

    await cms.service('base::file').deleteById(fileId, options);
  },
});
