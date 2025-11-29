import { deleteFileOptions } from '@game-cms/base-types';
import { objectId } from '@game-cms/shared/mongo';
import { apiRoute } from '@game-cms/utils';
import z from 'zod';

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
  handler: async (req) => {
    const { fileId } = req.params;
    const options = req.query;

    await cms.service('base::file').deleteById(fileId, options);
  },
});
