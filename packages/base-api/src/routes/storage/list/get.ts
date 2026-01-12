import {
  listStorageItemsOptions,
  listStorageItemsResponse,
} from '@game-cms/base-core/schema';
import { apiRoute } from '@game-cms/core/api';
import { cms } from '@game-cms/global';

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
  handler: (req) => {
    const options = req.query;

    return cms().service('base::storage').list(options);
  },
});
