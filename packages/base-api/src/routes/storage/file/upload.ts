import type { MultipartFile } from '@fastify/multipart';
import { uploadFileMeta, uploadFileResponse } from '@game-cms/base-core/schema';
import { ApiError } from '@game-cms/core/api';
import { apiRoute } from '@game-cms/core/api';
import { cms } from '@game-cms/global';
import { parseJsonOptional } from '@game-cms/shared/json';

import { apiValidateValue } from '../../../utils/validate.js';

function getInfo(data: MultipartFile) {
  const metaField = data.fields.meta;
  if (metaField === undefined) {
    return undefined;
  }

  if (Array.isArray(metaField)) {
    throw new ApiError('Invalid info field format', 'base::schema/validation');
  }

  if (metaField.type !== 'field') {
    throw new ApiError('Info must not be a file', 'base::schema/validation');
  }

  const rawInfo = metaField.value;
  if (typeof rawInfo !== 'string') {
    throw new ApiError('Info must be a string', 'base::schema/validation');
  }

  return apiValidateValue(parseJsonOptional(rawInfo), uploadFileMeta);
}

export default apiRoute({
  url: '/storage/file',
  method: 'POST',
  config: {
    id: 'storage/file$upload',
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

    const result = await cms()
      .service('base::storage')
      .uploadFile({
        name: data.filename,
        content: data.file,
        mime: data.mimetype,
        ...info,
      });

    return result;
  },
});
