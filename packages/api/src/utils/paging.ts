import type { PageData, PagingOptions } from '@game-cms/shared';
import { pagingAggregatePipeline } from '@game-cms/shared/mongo';
import type { Collection, Document } from 'mongodb';

export async function getPage<T extends Document, R = T>(
  collection: Collection<T>,
  options: PagingOptions,
  operators: Document[] = []
): Promise<PageData<R>> {
  const result = await collection
    .aggregate<PageData<R>>([pagingAggregatePipeline(options), ...operators])
    .next();

  if (result === null) {
    return { meta: { totalCount: 0 }, items: [] };
  }

  return result;
}
