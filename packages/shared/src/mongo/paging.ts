import type { Document } from 'mongodb';

import type { PagingOptions } from '../paging.js';

export type PagingAggregationResult<T> = {
  meta: {
    totalCount: number;
  };
  data: T[];
};

export function pagingAggregatePipeline(options: PagingOptions): Document {
  return {
    $facet: {
      meta: [{ $count: 'totalCount' }],
      data: [{ $skip: options.offset }, { $limit: options.size }],
    },
  };
}
