import type { Document } from 'mongodb';

import type { PagingOptions } from '../paging.js';

export function pagingAggregatePipeline(options: PagingOptions): Document {
  return {
    $facet: {
      meta: [{ $count: 'totalCount' }],
      items: [{ $skip: options.offset }, { $limit: options.size }],
    },
  };
}
