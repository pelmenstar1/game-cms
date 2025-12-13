import {
  listStorageItemsOptions,
  listStorageItemsResponse,
} from '@game-cms/base-types/schema';
import { cms } from '@game-cms/global';
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
  handler: (req) => {
    const options = req.query;

    return cms().service('base::storage').list(options);
  },
});
