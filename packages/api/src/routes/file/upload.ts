import type { MultipartFile } from '@fastify/multipart';
import { parseJsonOptional } from '@game-cms/shared';
import { ApiError, ApiErrorCode, apiValidateValue } from '@game-cms/shared-api';
import { apiRoute } from '@game-cms/shared-api';
import { uploadFileMeta, uploadFileResponse } from '@game-cms/types';

import { authHandler } from '../../middlewares/auth.js';

function getInfo(data: MultipartFile) {
  const infoField = data.fields.info;
  if (infoField === undefined) {
    return undefined;
  }

  if (Array.isArray(infoField)) {
    throw new ApiError(
      'Invalid info field format',
      ApiErrorCode.VALIDATION_ISSUE
    );
  }

  if (infoField.type !== 'field') {
    throw new ApiError(
      'Info must not be a file',
      ApiErrorCode.VALIDATION_ISSUE
    );
  }

  const rawInfo = infoField.value;
  if (typeof rawInfo !== 'string') {
    throw new ApiError('Info must be a string', ApiErrorCode.VALIDATION_ISSUE);
  }

  return apiValidateValue(parseJsonOptional(rawInfo), uploadFileMeta);
}

export default apiRoute({
  url: `/file`,
  method: 'POST',
  config: {
    id: 'file$upload',
  },
  schema: {
    response: {
      200: uploadFileResponse,
    },
  },
  preHandler: [authHandler()],
  handler: async (req) => {
    const data = await req.file();
    if (data === undefined) {
      throw new ApiError('No file', ApiErrorCode.VALIDATION_ISSUE);
    }

    const info = getInfo(data);

    const result = await cms.service('base::file').upload({
      name: data.filename,
      content: data.file,
      mime: data.mimetype,
      folderId: info?.folderId,
    });

    return result;
  },
});
