import type {
  EntityId,
  EntityRawDataById,
  EntityRawInDataById,
  EntityStorageDataById,
} from '@game-cms/base-types';
import { ApiError } from '@game-cms/base-utils';
import type { ComponentDataResolverArgs } from '@game-cms/core';
import { service } from '@game-cms/core';
import { cms } from '@game-cms/global';
import type { PagingOptions } from '@game-cms/shared';
import { asyncMapObject, mapObject } from '@game-cms/shared/object';
import type {
  Filter,
  ObjectId,
  OptionalUnlessRequiredId,
  WithId,
} from 'mongodb';

import { getPage } from '../utils/paging.js';

function collection<T extends EntityId>(id: T) {
  return cms().service('base::database').entityCollection(id);
}

function idFilter<T>(id: ObjectId) {
  return { _id: id } as Filter<T>;
}

function getEntitySchema<T extends EntityId>(entityId: T) {
  const result = cms().service('base::entitySchema').getById(entityId);
  if (result === null) {
    throw new ApiError('Unknown entity', 'base::entity/notFound');
  }

  return result;
}

async function getRawById<T extends EntityId>(entityId: T, id: ObjectId) {
  const entitySchema = getEntitySchema(entityId);
  const result = await collection(entityId).findOne(idFilter(id));

  if (result === null) {
    return null;
  }

  const { _id, ...ownResult } = result;
  const { foreignStorageResolverContext } = cms().service('base::component');

  const rawResult = await asyncMapObject(
    ownResult as unknown as EntityStorageDataById<T>,
    (item, key) => {
      const { componentId, options } = entitySchema.components[key];

      return foreignStorageResolverContext.fromStorage(
        componentId,
        item,
        options
      );
    }
  );

  return { _id, ...rawResult } as WithId<EntityRawDataById<T>>;
}

async function toStorageData<T extends EntityId>(
  entityId: T,
  rawData: EntityRawInDataById<T>
): Promise<EntityStorageDataById<T>> {
  const entitySchema = getEntitySchema(entityId);
  const { foreignStorageResolverContext } = cms().service('base::component');

  return asyncMapObject(rawData, (item, key) => {
    const { componentId, options } = entitySchema.components[key];

    return foreignStorageResolverContext.toStorage(componentId, item, options);
  });
}

export default service({
  id: 'base::entity',
  create: async <T extends EntityId>(id: T, data: EntityRawInDataById<T>) => {
    const storageData = await toStorageData(id, data);
    const result = await collection(id).insertOne(
      storageData as OptionalUnlessRequiredId<EntityRawInDataById<T>>
    );

    return { _id: result.insertedId, ...storageData };
  },
  update: async <Id extends EntityId>(
    entityId: Id,
    id: ObjectId,
    data: EntityRawInDataById<Id>
  ) => {
    const result = await collection(entityId).updateOne(idFilter(id), {
      $set: await toStorageData(entityId, data),
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
  getResolvedById: async <Id extends EntityId>(
    entityId: Id,
    id: ObjectId,
    args: ComponentDataResolverArgs
  ) => {
    const entitySchema = getEntitySchema(entityId);
    const { foreignResolverContext } = cms().service('base::component');

    const result = await getRawById(entityId, id);

    if (result === null) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...ownResult } = result;

    return mapObject(
      ownResult as unknown as EntityRawDataById<Id>,
      (item, key) => {
        const { componentId, options: baseOptions } =
          entitySchema.components[key];

        return foreignResolverContext.resolveRawData(
          componentId,
          item,
          baseOptions,
          args
        );
      }
    );
  },
});
