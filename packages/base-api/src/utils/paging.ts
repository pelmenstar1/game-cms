import type { PageData, PagingOptions } from '@game-cms/shared';
import { pagingAggregatePipeline } from '@game-cms/shared/mongo';
import type { Collection, Document, WithId } from 'mongodb';

export async function getPage<T extends Document, R = T>(
  collection: Collection<T>,
  options: PagingOptions,
  operators: Document[] = []
) {
  const result = await collection
    .aggregate<
      PageData<WithId<R>>
    >([pagingAggregatePipeline(options), ...operators])
    .next();

  if (result === null) {
    return { meta: { totalCount: 0 }, items: [] };
  }

  return result;
}
