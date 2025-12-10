import { serverStorageFileMeta } from '@game-cms/base-types';
import { ApiError } from '@game-cms/base-utils';
import { objectId } from '@game-cms/shared/mongo';
import { apiRoute } from '@game-cms/utils';
import z from 'zod';

export default apiRoute({
  url: '/file/byId/:fileId',
  method: 'GET',
  config: {
    id: 'file/meta$get',
  },
  schema: {
    params: z.object({
      fileId: objectId,
    }),
    response: {
      200: serverStorageFileMeta,
    },
  },
  handler: async (req) => {
    const { fileId } = req.params;
    const fileService = cms.service('base::file');

    const meta = await fileService.getMeta(fileId);
    if (meta === null) {
      throw new ApiError('Unknown file', 'base::entity/notFound');
    }

    return meta;
  },
});
