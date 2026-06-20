import {
  AbortOptions,
  EntityId,
  EntityInDataById,
  EntityInternalOutDataById,
  EntityPartialInDataById,
  EntityPersistentDocumentById,
  EntityResolvedDataById,
  EntitySchemaById,
  EntityStorageDataById,
  EntityVariant,
  EntityVariantData,
} from '@game-cms/base-core';
import {
  ComponentDataResolverArgs,
  ComponentSchema,
  ComponentStorageDisposeDataParams,
  searchScoreComposer,
  service,
} from '@game-cms/core';
import { ApiError } from '@game-cms/core/api';
import { cms } from '@game-cms/global';
import { PagingOptions } from '@game-cms/shared';
import { maybeLongAdd } from '@game-cms/shared/mongo';
import { asyncMapObject, mapObject } from '@game-cms/shared/object';
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
    'base::entity::read': {
      entityId: EntityId;
      id: ObjectId;
      variant: EntityVariant;
      resolvedAt: Date;
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
    throw new ApiError('Unknown entity', { code: 'base::entity/notFound' });
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

async function transformInDataToStorage<Id extends EntityId>(
  entityId: Id,
  inData: EntityInDataById<Id>
): Promise<EntityStorageDataById<Id>> {
  const schema = getEntitySchema(entityId);
  const { foreignStorageResolverContext } = cms().service('base::component');

  const components = await asyncMapObject(inData, (item, key) => {
    const { componentId, options } = schema.components[key];

    return foreignStorageResolverContext.toStorage(componentId, item, options);
  });

  const search = await cms()
    .service('base::entity::search')
    .createIndex(components, schema);

  return {
    variantId: Long.ZERO,
    components,
    meta: { lastUpdatedTime: Date.now() },
    search,
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

  return {
    ...target,
    variantId: maybeLongAdd(target.variantId, 1),
    components: {
      ...target.components,
      ...sourceMerged,
    },
    meta: { lastUpdatedTime: Date.now() },
  };
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
  lifecycle: {},
  storageDataToOut,
  create: async <Id extends EntityId>(
    id: Id,
    data: EntityInDataById<Id>,
    variant: EntityVariant = 'published'
  ) => {
    const storageData = await transformInDataToStorage(id, data);

    await cms().service('base::entityCheck').run({
      entityId: id,
      documentData: storageData,
      documentVariant: variant,
    });

    const { insertedId } = await collection(id).insertOne(
      createEntityVariants(storageData, variant)
    );

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

    const resolved = resolveRawEntity(entityId, result, args);

    cms().service('base::appEvents').emit('base::entity::read', {
      entityId,
      id,
      variant,
      resolvedAt: new Date(),
    });

    return resolved;
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
