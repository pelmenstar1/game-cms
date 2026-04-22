import { listStorageItemsOptions } from '@game-cms/base-core/schema';
import { apiRoute } from '@game-cms/core/api';
import { cms } from '@game-cms/global';

export default apiRoute({
  url: '/storage/items/list',
  method: 'GET',
  config: {
    id: 'storage$list',
  },
  schema: {
    querystring: listStorageItemsOptions.strict(),
  },
  handler: (req) => {
    const options = req.query;

    return cms()
      .service('base::storage')
      .list({ ...options, signal: req.abortSignal });
  },
});
