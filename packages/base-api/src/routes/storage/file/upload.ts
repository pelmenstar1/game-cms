import { uploadFileMeta, uploadFileResponse } from '@game-cms/base-core/schema';
import { ApiError } from '@game-cms/core/api';
import { apiRoute } from '@game-cms/core/api';
import { cms } from '@game-cms/global';
import { parseJsonOptional } from '@game-cms/shared/json';
import { FileSource } from '@game-cms/shared/node';

import { apiValidateValue } from '../../../utils/validate.js';

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
    let file:
      | { buffer: FileSource; filename: string; mimetype: string }
      | undefined;
    let metaRaw: string | undefined;

    for await (const part of req.parts()) {
      if (part.type === 'file') {
        file = {
          buffer: await part.toBuffer(),
          filename: part.filename,
          mimetype: part.mimetype,
        };
      } else if (part.fieldname === 'meta' && typeof part.value === 'string') {
        metaRaw = part.value;
      }
    }

    if (file === undefined) {
      throw new ApiError('No file', { code: 'base::schema/validation' });
    }

    const meta = metaRaw
      ? apiValidateValue(parseJsonOptional(metaRaw), uploadFileMeta)
      : undefined;

    const result = await cms()
      .service('base::storage')
      .uploadFile({
        name: file.filename,
        content: file.buffer,
        mime: file.mimetype,
        ...meta,
      });

    return result;
  },
});
