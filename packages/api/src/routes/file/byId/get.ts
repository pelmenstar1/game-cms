import { objectId } from '@game-cms/shared/mongo';
import { ApiError, ApiErrorCode } from '@game-cms/shared-api';
import { apiRoute } from '@game-cms/shared-api';
import { clientStorageFileMeta } from '@game-cms/types';
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
      200: clientStorageFileMeta,
    },
  },
  handler: async (req) => {
    const { fileId } = req.params;
    const fileService = cms.service('base::file');

    const meta = await fileService.getMeta(fileId);
    if (meta === null) {
      throw new ApiError('Unknown file', ApiErrorCode.ENTITY_NOT_FOUND);
    }

    return meta;
  },
});
