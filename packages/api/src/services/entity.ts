import {
  type ConditionalValueInput,
  type EntityConditionalData,
  resolveConditionalEntity,
} from '@game-cms/conditional';
import type { EntityData } from '@game-cms/types';
import type { Filter, ObjectId, WithId } from 'mongodb';

import { service } from '../utils.js';

function collection<T extends EntityData>(id: string) {
  return cms.service('base::database').entityCollection<T>(id);
}

function idFilter<T>(id: ObjectId) {
  return { _id: id } as Filter<T>;
}

export default service({
  id: 'base::entity',
  create: async <T extends EntityConditionalData>(id: string, data: T) => {
    const result = await collection(id).insertOne(data);

    return { _id: result.insertedId, ...data };
  },
  update: async (
    entityId: string,
    id: ObjectId,
    data: EntityConditionalData
  ) => {
    const result = await collection(entityId).updateOne(idFilter(id), data);

    return result.matchedCount > 0;
  },
  deleteById: async (entityId: string, id: ObjectId) => {
    await collection(entityId).deleteOne(idFilter(id));
  },
  getById: async <T extends EntityData>(
    entityId: string,
    id: ObjectId,
    input: ConditionalValueInput
  ) => {
    const result = await collection<T>(entityId).findOne(idFilter(id));

    if (result === null) {
      return null;
    }

    const { _id, ...rest } = result;
    const resolved = resolveConditionalEntity<T>(
      rest as unknown as EntityConditionalData<T>,
      input
    );

    return { _id, ...resolved } as unknown as WithId<T>;
  },
});
