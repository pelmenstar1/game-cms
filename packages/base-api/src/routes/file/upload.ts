import type { MultipartFile } from '@fastify/multipart';
import { uploadFileMeta, uploadFileResponse } from '@game-cms/base-types';
import { ApiError } from '@game-cms/base-utils';
import { parseJsonOptional } from '@game-cms/shared';
import { apiRoute } from '@game-cms/utils';

import { apiValidateValue } from '../../utils/validate.js';

function getInfo(data: MultipartFile) {
  const infoField = data.fields.info;
  if (infoField === undefined) {
    return undefined;
  }

  if (Array.isArray(infoField)) {
    throw new ApiError('Invalid info field format', 'base::schema/validation');
  }

  if (infoField.type !== 'field') {
    throw new ApiError('Info must not be a file', 'base::schema/validation');
  }

  const rawInfo = infoField.value;
  if (typeof rawInfo !== 'string') {
    throw new ApiError('Info must be a string', 'base::schema/validation');
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
  handler: async (req) => {
    const data = await req.file();
    if (data === undefined) {
      throw new ApiError('No file', 'base::schema/validation');
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
