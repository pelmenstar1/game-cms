import {
  AbortOptions,
  BaseEntityStorageDataById,
  EntityErrorById,
  EntityId,
  EntityInDataById,
  EntityInternalOutDataById,
  EntityPartialInDataById,
  EntityPersistentDocumentById,
  EntityResolvedDataById,
  EntitySchema,
  EntitySchemaById,
  EntitySearchIndexDataById,
  EntityStorageDataById,
  EntityVariant,
  EntityVariantData,
} from '@game-cms/base-core';
import {
  ComponentDataResolverArgs,
  ComponentDataStructure,
  ComponentSchema,
  ComponentStorageDisposeDataParams,
  searchScoreComposer,
} from '@game-cms/core';
import { service } from '@game-cms/core';
import { ApiError } from '@game-cms/core/api';
import { cms, log } from '@game-cms/global';
import { isNonNullObject, PagingOptions } from '@game-cms/shared';
import { maybeLongAdd } from '@game-cms/shared/mongo';
import {
  asyncMapObject,
  deepEquals,
  mapObject,
  UnknownObject,
} from '@game-cms/shared/object';
import { Long, ObjectId } from 'mongodb';

import { getPage } from '../../utils/paging.js';

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

  interface DatabaseCollectionTypeMap {
    'base::entityStructure': {
      entityId: EntityId;
      structure: Record<string, ComponentDataStructure>;
    };
  }
}

const SEARCH_THRESHOLD = 0.8;

function collection<T extends EntityId>(id: T) {
  return cms().service('base::database').entityCollection(id);
}

function getEntitySchema<Id extends EntityId>(entityId: Id) {
  const result = cms().service('base::entitySchema').getSchemaById(entityId);
  if (result === undefined) {
    throw new ApiError('Unknown entity', 'base::entity/notFound');
  }

  return result;
}

type StorageDataToOutOptions<Id extends EntityId> = {
  entityId: Id;
  documentId: ObjectId;
  documentVariant: EntityVariant;
  storageData: EntityStorageDataById<Id>;
};

async function storageDataToOut<Id extends EntityId>(
  options: StorageDataToOutOptions<Id>
): Promise<EntityInternalOutDataById<Id>> {
  const { entityId, documentId, documentVariant, storageData } = options;
  const { components, meta, checks } = storageData;

  const schema = getEntitySchema(entityId);

  const { foreignStorageResolverContext } = cms().service('base::component');

  const rawComponents = await asyncMapObject(components, (item, key) => {
    const { componentId, options } = schema.components[key];

    return foreignStorageResolverContext.fromStorage(
      componentId,
      item,
      options
    );
  });

  const clientChecksData = await cms()
    .service('base::entityCheck')
    .getClientData(checks ?? {}, {
      entityId,
      documentMeta: meta,
      documentVariant,
      documentId,
    });

  return {
    id: documentId,
    components: rawComponents,
    meta: meta,
    checks: clientChecksData,
  };
}

async function getRawById<Id extends EntityId>(
  entityId: Id,
  documentId: ObjectId,
  documentVariant: EntityVariant = 'published',
  options?: AbortOptions
): Promise<EntityInternalOutDataById<Id> | null> {
  const result = await collection(entityId).findOne(
    { _id: documentId },
    {
      projection: { [documentVariant]: 1 },
      signal: options?.signal,
    }
  );

  if (result === null) {
    return null;
  }

  const { [documentVariant]: storageData } = result;

  if (storageData === undefined) {
    return null;
  }

  return storageDataToOut({
    entityId,
    documentId,
    documentVariant,
    storageData,
  });
}

function resolveRawEntity<Id extends EntityId>(
  entityId: Id,
  result: EntityInternalOutDataById<Id>,
  args: ComponentDataResolverArgs
): EntityResolvedDataById<Id> {
  const schema = getEntitySchema(entityId);
  const { foreignResolverContext } = cms().service('base::component');

  return mapObject(result.components, (item, key) => {
    const { componentId, options: baseOptions } = schema.components[key];

    return foreignResolverContext.resolveOutData(
      componentId,
      item,
      baseOptions,
      args
    );
  });
}

async function getRawSingleton<Id extends EntityId>(
  entityId: Id,
  documentVariant: EntityVariant = 'published',
  options?: AbortOptions
): Promise<EntityInternalOutDataById<Id> | null> {
  const result = await collection(entityId).findOne(
    { [documentVariant]: { $exists: true } },
    {
      projection: { [documentVariant]: 1 },
      signal: options?.signal,
    }
  );

  if (result === null) {
    return null;
  }

  const { _id, [documentVariant]: storageData } = result;

  if (storageData === undefined) {
    return null;
  }

  return storageDataToOut({
    entityId,
    documentId: _id,
    documentVariant,
    storageData,
  });
}

function createSearchIndex<Id extends EntityId>(
  storageData: BaseEntityStorageDataById<Id>,
  schema: EntitySchemaById<Id>
): EntitySearchIndexDataById<Id> {
  const { foreignDataSearchContext } = cms().service('base::component');

  return mapObject(schema.components, (component, key) => {
    const { componentId, options } = component;

    return foreignDataSearchContext.createSearchIndex(
      componentId,
      storageData[key],
      options
    );
  });
}

async function transformInDataToStorage<Id extends EntityId>(
  entityId: Id,
  inData: EntityInDataById<Id>
) {
  const schema = getEntitySchema(entityId);
  const { foreignStorageResolverContext } = cms().service('base::component');

  const components = await asyncMapObject(inData, (item, key) => {
    const { componentId, options } = schema.components[key];

    return foreignStorageResolverContext.toStorage(componentId, item, options);
  });

  return {
    variantId: Long.ZERO,
    components,
    meta: {
      lastUpdatedTime: Date.now(),
    },
    search: createSearchIndex(components, schema),
    checks: {},
  };
}

async function transformPartialInDataToStorage<Id extends EntityId>(
  entityId: Id,
  target: EntityStorageDataById<Id>,
  source: EntityPartialInDataById<Id>
): Promise<EntityStorageDataById<Id>> {
  const schema = getEntitySchema(entityId);
  const { foreignDataMergeContext } = cms().service('base::component');

  const sourceMergedEntries = await Promise.all(
    Object.entries<unknown>(source).map(async ([key, item]) => {
      if (item === undefined) {
        return;
      }

      const { componentId, options } = schema.components[key];

      const result = await foreignDataMergeContext.merge(
        componentId,
        target.components[key],
        item as never,
        options
      );

      return [key, result] as const;
    })
  );

  const sourceMerged = Object.fromEntries(
    sourceMergedEntries.filter(Boolean) as [string, unknown][]
  );

  const result: EntityStorageDataById<Id> = {
    ...target,
    variantId: maybeLongAdd(target.variantId, 1),
    components: {
      ...target.components,
      ...sourceMerged,
    },
    meta: { lastUpdatedTime: Date.now() },
  };

  return result;
}

function createEntityVariants<Id extends EntityId>(
  value: EntityStorageDataById<Id>,
  variant: EntityVariant
): EntityPersistentDocumentById<Id> {
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

  const newComponents = mapObject(schema.components, (prop, key) => {
    return foreignDataMigrationContext.migrate(
      prop.componentId,
      (oldValue.components as UnknownObject)[key],
      prop.options
    );
  });

  return {
    variantId: maybeLongAdd(oldValue.variantId, 1),
    meta: oldValue.meta,
    checks: oldValue.checks,
    components: newComponents,
    search: createSearchIndex(newComponents, schema),
  };
}

function validate<Id extends EntityId>(
  value: unknown,
  schema: EntitySchemaById<Id>
): EntityErrorById<Id> | undefined {
  if (!isNonNullObject(value)) {
    return { ownError: 'INVALID_TYPE' };
  }

  const { foreignValidationContext } = cms().service('base::component');

  const entries = Object.entries<ComponentSchema>(schema.components).map(
    ([key, prop]) => {
      const error = foreignValidationContext.validate(
        prop.componentId,
        value[key],
        prop.options
      );

      return [key, error] as const;
    }
  );

  if (entries.some(([, value]) => value !== undefined)) {
    return {
      properties: Object.fromEntries(
        entries
      ) as EntityErrorById<Id>['properties'],
    };
  }
}

async function migrateEntityCollection<Id extends EntityId>(
  id: Id,
  schema: EntitySchemaById<Id>
) {
  const col = collection(id);

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

async function disposeEntity<Id extends EntityId>(
  entityId: Id,
  data: EntityStorageDataById<Id>,
  params?: ComponentStorageDisposeDataParams
) {
  const { foreignStorageResolverContext } = cms().service('base::component');

  const schema = getEntitySchema(entityId);

  await Promise.all(
    Object.entries<ComponentSchema>(schema.components).map(([key, item]) => {
      const { componentId, options } = item;

      return foreignStorageResolverContext.disposeData(
        componentId,
        data.components[key],
        options,
        params
      );
    })
  );
}

async function disposePersistentDocument<Id extends EntityId>(
  entityId: Id,
  document: EntityPersistentDocumentById<Id>,
  params?: ComponentStorageDisposeDataParams
) {
  const { draft, published } = document;
  const promises: Promise<void>[] = [disposeEntity(entityId, draft, params)];

  if (published && published.variantId !== draft.variantId) {
    promises.push(disposeEntity(entityId, published, params));
  }

  await Promise.all(promises);
}

function getEntitySearchScore<Id extends EntityId>(
  query: string,
  data: EntityStorageDataById<Id>,
  schema: EntitySchemaById<Id>
) {
  const { search } = data;
  const { components } = schema;
  const { foreignDataSearchContext } = cms().service('base::component');

  const composer = searchScoreComposer();

  for (const key in components) {
    const { componentId, options } = components[key];

    composer.include(
      foreignDataSearchContext.getScore(
        query,
        componentId,
        { storage: data.components[key], searchIndex: search[key] },
        options
      )
    );
  }

  return composer.result();
}

export default service({
  id: 'base::entity',
  lifecycle: {
    onInit: {
      dependsOn: ['base::entitySchema', 'base::database'],
      action: async () => {
        const schemas = cms().service('base::entitySchema').getAll();

        const col = cms()
          .service('base::database')
          .collection('base::entityStructure');

        const oldStructures = await col.find().toArray();

        for (const [id, descriptor] of Object.entries(schemas)) {
          const oldStructure = oldStructures.find(
            ({ entityId }) => entityId === id
          );

          const newStructure = getEntityDataStructure(descriptor.schema);

          if (oldStructure === undefined) {
            await col.insertOne({ entityId: id, structure: newStructure });
          } else if (!deepEquals(oldStructure.structure, newStructure)) {
            log().child({ service: 'base::entity' }).info('Migrating %s', id);

            await migrateEntityCollection(id, descriptor.schema);

            await col.updateOne(
              { entityId: id },
              { $set: { structure: newStructure } }
            );
          }
        }
      },
    },
  },
  storageDataToOut,
  create: async <Id extends EntityId>(
    id: Id,
    data: EntityInDataById<Id>,
    variant: EntityVariant = 'published'
  ) => {
    const storageData = await transformInDataToStorage(id, data);

    const { insertedId } = await collection(id).insertOne(
      createEntityVariants(storageData, variant)
    );

    await cms().service('base::entityCheck').run({
      entityId: id,
      documentId: insertedId,
      documentData: storageData,
      documentVariant: variant,
    });

    cms().service('base::appEvents').emit('base::entity::created', {
      entityId: id,
      id: insertedId,
      variant,
      data: storageData,
    });

    return { id: insertedId, ...storageData };
  },
  update: async <Id extends EntityId>(
    entityId: Id,
    documentId: ObjectId,
    data: EntityPartialInDataById<Id>,
    variant: EntityVariant = 'published'
  ) => {
    const col = collection(entityId);

    const target = await col.findOne({ _id: documentId });
    if (target === null) {
      return false;
    }

    const storageData = await transformPartialInDataToStorage(
      entityId,
      target.draft,
      data
    );

    try {
      await cms().service('base::entityCheck').run({
        entityId,
        documentId,
        documentData: storageData,
        documentVariant: variant,
      });
    } finally {
      await disposePersistentDocument(entityId, target, { afterUpdate: true });
    }

    await col.updateOne(
      { _id: documentId },
      {
        $set: createEntityVariants(storageData, variant),
      }
    );

    cms().service('base::appEvents').emit('base::entity::updated', {
      entityId,
      id: documentId,
      variant,
      newData: storageData,
    });

    return true;
  },
  deleteById: async (entityId: string, documentId: ObjectId) => {
    const deletedDocument = await collection(entityId).findOneAndDelete({
      _id: documentId,
    });

    if (deletedDocument !== null) {
      const { draft, published } = deletedDocument;

      cms()
        .service('base::appEvents')
        .emit('base::entity::deleted', { entityId, id: documentId });

      await Promise.all([
        disposeEntity(entityId, draft),
        published && disposeEntity(entityId, published),
      ]);

      return true;
    }

    return false;
  },
  list: async <Id extends EntityId>(
    entityId: Id,
    options: PagingOptions & AbortOptions
  ) => {
    const documentVariant: EntityVariant = 'draft';
    const result = await getPage(collection(entityId), options);

    return {
      items: await Promise.all(
        result.items.map((item) =>
          storageDataToOut({
            entityId,
            documentId: item._id,
            documentVariant,
            storageData: item[documentVariant],
          })
        )
      ),
      meta: result.meta,
    };
  },
  getRawById,
  getRawSingleton,
  getResolvedSingleton: async <Id extends EntityId>(
    entityId: Id,
    args: ComponentDataResolverArgs,
    variant: EntityVariant = 'published',
    options?: AbortOptions
  ): Promise<EntityResolvedDataById<Id> | null> => {
    const result = await getRawSingleton(entityId, variant, options);

    if (result === null) {
      return null;
    }

    return resolveRawEntity(entityId, result, args);
  },
  getResolvedById: async <Id extends EntityId>(
    entityId: Id,
    id: ObjectId,
    args: ComponentDataResolverArgs,
    variant: EntityVariant = 'published',
    options?: AbortOptions
  ): Promise<EntityResolvedDataById<Id> | null> => {
    const result = await getRawById(entityId, id, variant, options);

    if (result === null) {
      return null;
    }

    return resolveRawEntity(entityId, result, args);
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
  search: async <Id extends EntityId>(
    entityId: Id,
    query: string,
    options: PagingOptions & AbortOptions
  ) => {
    const documentVariant: EntityVariant = 'draft';
    const schema = getEntitySchema(entityId);

    const allItems: { id: ObjectId; data: EntityStorageDataById<Id> }[] = [];

    const cursor = collection(entityId).find({}, { signal: options.signal });

    for await (const item of cursor) {
      const variantData = item[documentVariant];
      const score = getEntitySearchScore(query, variantData, schema);

      if (score > SEARCH_THRESHOLD) {
        allItems.push({ id: item._id, data: variantData });
      }
    }

    const offset = options.offset ?? 0;

    return {
      items: await Promise.all(
        allItems.slice(offset, offset + options.size).map((item) =>
          storageDataToOut({
            entityId,
            documentVariant,
            documentId: item.id,
            storageData: item.data,
          })
        )
      ),
      meta: {
        totalCount: allItems.length,
      },
    };
  },
});
