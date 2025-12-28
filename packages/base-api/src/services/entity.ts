/* eslint-disable @typescript-eslint/no-unnecessary-type-parameters */
import type { EntityDataById, EntityId } from '@game-cms/base-types';
import { ApiError } from '@game-cms/base-utils';
import { cms } from '@game-cms/global';
import type { PagingOptions } from '@game-cms/shared';
import type { ComponentDataResolverArgs } from '@game-cms/types';
import { service } from '@game-cms/utils';
import type { Filter, ObjectId, OptionalUnlessRequiredId } from 'mongodb';

import { getPage } from '../utils/paging.js';

function collection<T extends EntityId>(id: T) {
  return cms().service('base::database').entityCollection(id);
}

function idFilter<T>(id: ObjectId) {
  return { _id: id } as Filter<T>;
}

async function getRawById<T extends EntityId>(entityId: T, id: ObjectId) {
  const result = await collection(entityId).findOne(idFilter(id));

  if (result === null) {
    return null;
  }

  return result;
}

export default service({
  id: 'base::entity',
  create: async <T extends EntityId>(
    id: T,
    data: OptionalUnlessRequiredId<EntityDataById<T>>
  ) => {
    const result = await collection(id).insertOne(data);

    return { _id: result.insertedId, ...data };
  },
  update: async <T extends EntityId>(
    entityId: T,
    id: ObjectId,
    data: EntityDataById<T>
  ) => {
    const result = await collection(entityId).updateOne(idFilter(id), {
      $set: data,
    });

    return result.matchedCount > 0;
  },
  deleteById: async (entityId: string, id: ObjectId) => {
    await collection(entityId).deleteOne(idFilter(id));
  },
  list: async <T extends EntityId>(entityId: T, options: PagingOptions) => {
    const result = await getPage(collection(entityId), options);

    return result;
  },
  getRawById,
  getById: async <T extends EntityId>(
    entityId: T,
    id: ObjectId,
    args: ComponentDataResolverArgs
  ) => {
    const entitySchema = cms().service('base::entitySchema').getById(entityId);
    if (entitySchema === null) {
      throw new ApiError('Unknown entity', 'base::entity/notFound');
    }

    const { foreignComponentContext } = cms().service('base::component');

    const result = await getRawById(entityId, id);

    if (result === null) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...value } = result;

    const entries = Object.entries(value)
      .filter(([key]) => key !== '_id')
      .map(([key, item]) => {
        const componentSchema = entitySchema.components[key];

        const resolvedData = foreignComponentContext.resolver.data(
          componentSchema.controller.meta.id,
          item,

          componentSchema.options,
          args
        );

        return [key, resolvedData] as const;
      });

    return Object.fromEntries(entries);
  },
});
