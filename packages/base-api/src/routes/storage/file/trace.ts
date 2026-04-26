import {
  TraceFileConciseResponse,
  TraceFileResponse,
} from '@game-cms/base-core';
import { traceFileOptions } from '@game-cms/base-core/schema';
import { apiRoute } from '@game-cms/core/api';
import { cms } from '@game-cms/global';
import { stringObjectId } from '@game-cms/shared/mongo';
import z from 'zod';

export default apiRoute({
  url: '/storage/file/:id/trace',
  method: 'GET',
  config: {
    id: 'storage/file$trace',
  },
  schema: {
    params: z.object({
      id: stringObjectId,
    }),
    querystring: traceFileOptions,
  },
  handler: async (
    req
  ): Promise<TraceFileResponse | TraceFileConciseResponse> => {
    const result = await cms()
      .service('base::entity::traceFile')
      .traceFile(req.params.id);

    const { offset = 0, size, concise = false } = req.query;
    const items = result.slice(offset, offset + size);

    const resolvedItems = concise
      ? items.map(({ entityId, document }) => ({
          entityId,
          document: { id: document.id },
        }))
      : items;

    return { items: resolvedItems, meta: { totalCount: result.length } };
  },
});
