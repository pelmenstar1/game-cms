import {
  ApiError,
  type EntityId,
  type EntityRawDataById,
  type EntityRawInDataById,
  type EntityResolvedDataById,
  type EntityStorageDataById,
  type EntityVariant,
  type EntityVariantData,
} from '@game-cms/base-core';
import type { ComponentDataResolverArgs } from '@game-cms/core';
import { service } from '@game-cms/core';
import { cms } from '@game-cms/global';
import type { PagingOptions } from '@game-cms/shared';
import { asyncMapObject, mapObject } from '@game-cms/shared/object';
import type { Filter, ObjectId, WithId } from 'mongodb';

import { getPage } from '../utils/paging.js';

declare module '@game-cms/base-core' {
  interface AppEventsRegistry {
    'base::entity::created': {
      entityId: EntityId;
      id: ObjectId;
      variant: EntityVariant;
      data: EntityVariantData;
    };
    'base::entity::updated': {
      entityId: EntityId;
      id: ObjectId;
      variant: EntityVariant;
      newData: EntityVariantData;
    };
    'base::entity::deleted': {
      entityId: EntityId;
      id: ObjectId;
    };
    'base::entity::unpublished': {
      entityId: EntityId;
      id: ObjectId;
    };
  }
}

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

async function getRawById<T extends EntityId>(
  entityId: T,
  id: ObjectId,
  variant: EntityVariant = 'published'
) {
  const entitySchema = getEntitySchema(entityId);
  const result = await collection(entityId).findOne(idFilter(id), {
    projection: { [variant]: 1 },
  });

  if (result === null) {
    return null;
  }

  const { _id, [variant]: data } = result;
  if (data === undefined) {
    return null;
  }

  const { foreignStorageResolverContext } = cms().service('base::component');

  const rawResult = await asyncMapObject(data, (item, key) => {
    const { componentId, options } = entitySchema.components[key];

    return foreignStorageResolverContext.fromStorage(
      componentId,
      item,
      options
    );
  });

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

function createEntityVariants<Id extends EntityId>(
  value: EntityStorageDataById<Id>,
  variant: EntityVariant
) {
  return variant == 'published'
    ? {
        published: value,
        draft: value,
      }
    : { draft: value };
}

export default service({
  id: 'base::entity',
  create: async <T extends EntityId>(
    id: T,
    data: EntityRawInDataById<T>,
    variant: EntityVariant = 'published'
  ) => {
    const storageData = await toStorageData(id, data);
    const { insertedId } = await collection(id).insertOne(
      createEntityVariants(storageData, variant)
    );

    cms().service('base::appEvents').emit('base::entity::created', {
      entityId: id,
      id: insertedId,
      variant,
      data: storageData,
    });

    return { _id: insertedId, ...storageData };
  },
  update: async <Id extends EntityId>(
    entityId: Id,
    id: ObjectId,
    data: EntityRawInDataById<Id>,
    variant: EntityVariant = 'published'
  ) => {
    const storageData = await toStorageData(entityId, data);

    const result = await collection(entityId).updateOne(idFilter(id), {
      $set: createEntityVariants(storageData, variant),
    });

    const isUpdated = result.matchedCount > 0;

    if (isUpdated) {
      cms().service('base::appEvents').emit('base::entity::updated', {
        entityId,
        id,
        variant,
        newData: storageData,
      });
    }

    return isUpdated;
  },
  deleteById: async (entityId: string, id: ObjectId) => {
    const { deletedCount } = await collection(entityId).deleteOne(idFilter(id));
    const isDeleted = deletedCount > 0;

    if (isDeleted) {
      cms()
        .service('base::appEvents')
        .emit('base::entity::deleted', { entityId, id });
    }

    return isDeleted;
  },
  list: async <T extends EntityId>(entityId: T, options: PagingOptions) => {
    const result = await getPage(collection(entityId), options);

    return result;
  },
  getRawById,
  getRawVariantsById: async <Id extends EntityId>(
    entityId: Id,
    id: ObjectId
  ) => {
    const result = await collection(entityId).findOne({ _id: id });

    return result;
  },
  getResolvedById: async <Id extends EntityId>(
    entityId: Id,
    id: ObjectId,
    args: ComponentDataResolverArgs,
    variant: EntityVariant = 'published'
  ): Promise<EntityResolvedDataById<Id> | null> => {
    const entitySchema = getEntitySchema(entityId);
    const { foreignResolverContext } = cms().service('base::component');

    const result = await getRawById(entityId, id, variant);

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
  unpublish: async (entityId: EntityId, id: ObjectId) => {
    const { matchedCount } = await collection(entityId).updateOne(
      {
        _id: id,
      },
      {
        $unset: { published: 1 },
      }
    );

    if (matchedCount > 0) {
      cms()
        .service('base::appEvents')
        .emit('base::entity::unpublished', { entityId, id });
    }

    return matchedCount > 0;
  },
});
