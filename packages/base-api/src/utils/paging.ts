import { AbortOptions } from '@game-cms/base-core';
import type { PageData, PagingOptions } from '@game-cms/shared';
import { pagingAggregatePipeline } from '@game-cms/shared/mongo';
import type { Collection, Document, WithId } from 'mongodb';

type MongoPageData<T> = {
  items: WithId<T>[];
  meta: [] | [{ totalCount: number }];
};

export async function getPage<T extends Document, R = T>(
  collection: Collection<T>,
  options: PagingOptions & AbortOptions,
  operators: { pre?: Document[]; post?: Document[] } = {}
): Promise<PageData<WithId<R>>> {
  const result = await collection
    .aggregate<
      MongoPageData<R>
    >([...(operators.pre ?? []), pagingAggregatePipeline(options), ...(operators.post ?? [])], { signal: options.signal })
    .next();

  if (result === null) {
    return { meta: { totalCount: 0 }, items: [] };
  }

  return {
    items: result.items,
    meta: result.meta[0] ?? { totalCount: 0 },
  };
}
