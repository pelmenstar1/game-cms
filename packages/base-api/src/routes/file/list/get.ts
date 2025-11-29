import { listFilesOptions, listFilesResponse } from '@game-cms/base-types';
import { apiRoute } from '@game-cms/utils';

export default apiRoute({
  url: '/file/list',
  method: 'GET',
  config: {
    id: 'file$list',
  },
  schema: {
    querystring: listFilesOptions,
    response: {
      200: listFilesResponse,
    },
  },
  handler: async (req) => {
    const options = req.query;

    const fileService = cms.service('base::file');

    const result = await fileService.list(options);

    return result;
  },
});
