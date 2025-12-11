import {
  listStorageItemsOptions,
  listStorageItemsResponse,
} from '@game-cms/base-types';
import { apiRoute } from '@game-cms/utils';

export default apiRoute({
  url: '/storage/list',
  method: 'GET',
  config: {
    id: 'storage$list',
  },
  schema: {
    querystring: listStorageItemsOptions,
    response: { 200: listStorageItemsResponse },
  },
  handler: async (req) => {
    const options = req.query;

    return await cms.service('base::storage').list(options);
  },
});
