import {
  EntityDataVariantsById,
  EntityErrorById,
  EntityId,
  EntityMeta,
  EntityRawDataById,
  EntityRawDataWithChecksById,
  EntityRawInDataById,
  EntityRawInPartialDataById,
  EntityResolvedDataById,
  EntitySchema,
  EntitySchemaById,
  EntityStorageDataById,
  EntityVariant,
  EntityVariantData,
} from '@game-cms/base-core';
import {
  ComponentDataResolverArgs,
  ComponentDataStructure,
  ComponentId,
} from '@game-cms/core';
import { service } from '@game-cms/core';
import { ApiError } from '@game-cms/core/api';
import { cms, log } from '@game-cms/global';
import { isNonNullObject, PagingOptions } from '@game-cms/shared';
import {
  asyncMapObject,
  deepEquals,
  mapObject,
  UnknownObject,
} from '@game-cms/shared/object';
import { Filter, ObjectId, WithId } from 'mongodb';

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

  interface DatabaseEntityMap {
    'base::entityStructure': {
      entityId: EntityId;
      structure: Record<string, ComponentDataStructure>;
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

  return fromStorageData(entityId, _id, data);
}

async function fromStorageData<Id extends EntityId>(
  entityId: Id,
  objectId: ObjectId,
  storageData: EntityStorageDataById<Id>
) {
  const { '#meta': meta, '#checks': checks, ...componentsData } = storageData;
  const entitySchema = getEntitySchema(entityId);

  const { foreignStorageResolverContext } = cms().service('base::component');

  const rawComponents = await asyncMapObject(componentsData, (item, key) => {
    const { componentId, options } = entitySchema.components[key];

    return foreignStorageResolverContext.fromStorage(
      componentId,
      item,
      options
    );
  });

  const clientChecksData = await cms()
    .service('base::entityCheck')
    .getClientData(entityId, meta, objectId, checks ?? {});

  return {
    _id: objectId,
    '#checks': clientChecksData,
    ...rawComponents,
  } as unknown as WithId<EntityRawDataWithChecksById<Id>>;
}

async function toStorageData<Id extends EntityId>(
  entityId: Id,
  rawData: EntityRawInDataById<Id>
): Promise<EntityStorageDataById<Id>> {
  const entitySchema = getEntitySchema(entityId);
  const { foreignStorageResolverContext } = cms().service('base::component');
  const { run: runEntityChecks } = cms().service('base::entityCheck');

  const components = await asyncMapObject(rawData, (item, key) => {
    const { componentId, options } = entitySchema.components[key];

    return foreignStorageResolverContext.toStorage(componentId, item, options);
  });

  const entityMeta: EntityMeta = {
    lastUpdatedTime: Date.now(),
  };

  await runEntityChecks({
    entityId,
    entityData: components,
    entityMeta,
  });

  return {
    ...components,
    '#meta': entityMeta,
    '#checks': {},
  };
}

async function toStoragePartialData<Id extends EntityId>(
  entityId: Id,
  target: EntityStorageDataById<Id>,
  source: EntityRawInPartialDataById<Id>
): Promise<EntityStorageDataById<Id>> {
  const entitySchema = getEntitySchema(entityId);
  const { foreignDataMergeContext } = cms().service('base::component');

  const sourceMerged = await asyncMapObject(source, (item, key) => {
    const { componentId, options } = entitySchema.components[key];

    return foreignDataMergeContext.merge(
      componentId,
      target[key],
      item,
      options
    );
  });

  return {
    ...target,
    ...sourceMerged,
    '#meta': { lastUpdatedTime: Date.now() },
  };
}

function createEntityVariants<Id extends EntityId>(
  value: EntityStorageDataById<Id>,
  variant: EntityVariant
): EntityDataVariantsById<Id> {
  return variant == 'published'
    ? {
        published: value,
        draft: value,
      }
    : { draft: value };
}

function migrateEntity<Id extends EntityId>(
  schema: EntitySchemaById<Id>,
  oldValue: EntityVariantData
): EntityStorageDataById<Id> {
  const { foreignDataMigrationContext } = cms().service('base::component');

  const newValue = mapObject(schema.components, (prop, key) => {
    return foreignDataMigrationContext.migrate(
      prop.componentId,
      (oldValue as UnknownObject)[key],
      prop.options
    );
  });

  return {
    ...newValue,
    '#meta': oldValue['#meta'],
    '#checks': oldValue['#checks'],
  };
}

function validate<Id extends ComponentId>(
  value: unknown,
  schema: EntitySchemaById<Id>
): EntityErrorById<Id> | undefined {
  if (!isNonNullObject(value)) {
    return { ownError: 'INVALID_TYPE' };
  }

  const { foreignValidationContext } = cms().service('base::component');

  const entries = Object.entries(schema.components).map(([key, prop]) => {
    const error = foreignValidationContext.validate(
      prop.componentId,
      value[key],
      prop.options
    );

    return [key, error] as const;
  });

  if (entries.some(([, value]) => value !== undefined)) {
    return {
      properties: Object.fromEntries(
        entries
      ) as EntityErrorById<Id>['properties'],
    };
  }
}

async function migrateEntityCollection<Id extends EntityId>(
  schema: EntitySchemaById<Id>
) {
  const col = collection(schema.id);

  for await (const oldValue of col.find()) {
    // Only migrate if old value is no longer valid.
    if (validate(oldValue, schema) !== undefined) {
      const newDraft = migrateEntity(schema, oldValue.draft);
      const newPublished = oldValue.published
        ? migrateEntity(schema, oldValue.published)
        : undefined;

      await col.updateOne(
        { _id: oldValue._id },
        {
          $set: {
            draft: newDraft,
            published: newPublished,
          },
        }
      );
    }
  }
}

function getEntityDataStructure(schema: EntitySchema) {
  const { foreignDataStructureContext } = cms().service('base::component');

  return mapObject(schema.components, (prop) =>
    foreignDataStructureContext.getStructure(prop.componentId, prop.options)
  );
}

export default service({
  id: 'base::entity',
  lifecycle: {
    onInit: async () => {
      const schemas = cms().service('base::entitySchema').getAll();

      const col = cms()
        .service('base::database')
        .collection('base::entityStructure');

      const oldStructures = await col.find().toArray();

      for (const schema of schemas) {
        const oldStructure = oldStructures.find(
          ({ entityId }) => entityId === schema.id
        );

        const newStructure = getEntityDataStructure(schema);

        if (oldStructure === undefined) {
          await col.insertOne({ entityId: schema.id, structure: newStructure });
        } else if (!deepEquals(oldStructure.structure, newStructure)) {
          log()
            .child({ service: 'base::entity' })
            .info('Migrating %s', schema.id);

          await migrateEntityCollection(schema);

          await col.updateOne(
            { entityId: schema.id },
            { $set: { structure: newStructure } }
          );
        }
      }
    },
  },
  create: async <Id extends EntityId>(
    id: Id,
    data: EntityRawInDataById<Id>,
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
    data: EntityRawInPartialDataById<Id>,
    variant: EntityVariant = 'published'
  ) => {
    const target = await collection(entityId).findOne({ _id: id });
    if (target === null) {
      return false;
    }

    const storageData = await toStoragePartialData(
      entityId,
      target.draft,
      data
    );

    await collection(entityId).updateOne(idFilter(id), {
      $set: createEntityVariants(storageData, variant),
    });

    cms().service('base::appEvents').emit('base::entity::updated', {
      entityId,
      id,
      variant,
      newData: storageData,
    });

    return true;
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
  list: async <Id extends EntityId>(entityId: Id, options: PagingOptions) => {
    const result = await getPage(collection(entityId), options);

    return {
      items: await Promise.all(
        result.items.map((item) =>
          fromStorageData(entityId, item._id, item.draft)
        )
      ),
      meta: result.meta,
    };
  },
  getRawById,
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
