import {
  type ConditionalValueInput,
  type EntityConditionalDataById,
  resolveConditionalEntity,
} from '@game-cms/conditional';
import type { PagingOptions } from '@game-cms/shared';
import {
  pagingAggregatePipeline,
  type PagingAggregationResult,
} from '@game-cms/shared/mongo';
import type { EntityId } from '@game-cms/types';
import { service } from '@game-cms/utils';
import type { Filter, ObjectId, OptionalUnlessRequiredId } from 'mongodb';

function collection<T extends EntityId>(id: T) {
  return cms.service('base::database').entityCollection(id);
}

function idFilter<T>(id: ObjectId) {
  return { _id: id } as Filter<T>;
}

export default service({
  id: 'base::entity',
  create: async <T extends EntityId>(
    id: T,
    data: OptionalUnlessRequiredId<EntityConditionalDataById<T>>
  ) => {
    const result = await collection(id).insertOne(data);

    return { _id: result.insertedId, ...data };
  },
  update: async <T extends EntityId>(
    entityId: T,
    id: ObjectId,
    data: OptionalUnlessRequiredId<EntityConditionalDataById<T>>
  ) => {
    const result = await collection(entityId).updateOne(idFilter(id), data);

    return result.matchedCount > 0;
  },
  deleteById: async (entityId: string, id: ObjectId) => {
    await collection(entityId).deleteOne(idFilter(id));
  },
  list: async <T extends EntityId>(entityId: T, options: PagingOptions) => {
    const result = await collection(entityId)
      .aggregate<PagingAggregationResult<T>>([pagingAggregatePipeline(options)])
      .next();

    if (result === null) {
      return { meta: { totalCount: 0 }, data: [] };
    }

    return result;
  },
  getById: async <T extends EntityId>(
    entityId: string,
    id: ObjectId,
    input: ConditionalValueInput
  ) => {
    const result = await collection(entityId).findOne(idFilter(id));

    if (result === null) {
      return null;
    }

    const { _id, ...rest } = result;
    const resolved = resolveConditionalEntity(
      rest as unknown as EntityConditionalDataById<T>,
      input
    );

    return { _id, ...resolved };
  },
});
