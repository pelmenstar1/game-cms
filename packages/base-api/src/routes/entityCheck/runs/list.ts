import { listEntityCheckRunsOptions } from '@game-cms/base-core/schema';
import { apiRoute } from '@game-cms/core/api';
import { cms } from '@game-cms/global';

export default apiRoute({
  url: '/entityCheck/runs',
  method: 'GET',
  schema: {
    querystring: listEntityCheckRunsOptions,
  },
  config: {
    id: 'entity/[entityId]/runs$get',
  },
  handler: async (req) => {
    const { checkId, documentId, entityId, size, offset } = req.query;

    return cms().service('base::entityCheck::run').list({
      checkId,
      entityId,
      documentId,
      size,
      offset,
      signal: req.abortSignal,
    });
  },
});
