import {
  EntityErrorById,
  EntityId,
  EntitySchema,
  EntitySchemaById,
  EntityStorageDataById,
  EntityVariantData,
} from '@game-cms/base-core';
import {
  ComponentDataStructure,
  ComponentSchema,
  service,
} from '@game-cms/core';
import { cms, log } from '@game-cms/global';
import { isNonNullObject } from '@game-cms/shared';
import { maybeLongAdd } from '@game-cms/shared/mongo';
import { deepEquals, mapObject, UnknownObject } from '@game-cms/shared/object';
import { AnyBulkWriteOperation } from 'mongodb';

type EntityStructureEntry = {
  entityId: EntityId;
  structure: Record<string, ComponentDataStructure>;
};

declare module '@game-cms/base-core' {
  interface DatabaseCollectionTypeMap {
    'base::entityStructure': EntityStructureEntry;
  }
}

function getEntityDataStructure(schema: EntitySchema) {
  const { foreignDataStructureContext } = cms().service('base::component');

  return mapObject(schema.components, (prop) =>
    foreignDataStructureContext.getStructure(prop.componentId, prop.options)
  );
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

async function migrateEntity<Id extends EntityId>(
  schema: EntitySchemaById<Id>,
  oldValue: EntityVariantData
): Promise<EntityStorageDataById<Id>> {
  const { foreignDataMigrationContext } = cms().service('base::component');

  const newComponents = mapObject(schema.components, (prop, key) => {
    return foreignDataMigrationContext.migrate(
      prop.componentId,
      (oldValue.components as UnknownObject)[key],
      prop.options
    );
  });

  const search = await cms()
    .service('base::entity::search')
    .createIndex(newComponents, schema);

  return {
    variantId: maybeLongAdd(oldValue.variantId, 1),
    meta: oldValue.meta,
    checks: oldValue.checks,
    components: newComponents,
    search,
  };
}

async function migrateEntityCollection<Id extends EntityId>(
  id: Id,
  schema: EntitySchemaById<Id>
) {
  const col = cms().service('base::database').entityCollection(id);

  for await (const oldValue of col.find()) {
    // Only migrate if old value is no longer valid.
    if (validate(oldValue, schema) !== undefined) {
      const [newDraft, newPublished] = await Promise.all([
        migrateEntity(schema, oldValue.draft),
        oldValue.published && migrateEntity(schema, oldValue.published),
      ]);

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

async function migrate() {
  const schemas = cms().service('base::entitySchema').getAll();

  const col = cms()
    .service('base::database')
    .collection('base::entityStructure');

  const oldStructures = await col.find().toArray();

  const serviceLogger = log().child({ service: 'base::entity::migration' });

  const ops: AnyBulkWriteOperation<EntityStructureEntry>[] = [];

  for (const [id, descriptor] of Object.entries(schemas)) {
    const oldStructure = oldStructures.find(({ entityId }) => entityId === id);

    const newStructure = getEntityDataStructure(descriptor.schema);

    if (oldStructure === undefined) {
      ops.push({
        insertOne: { document: { entityId: id, structure: newStructure } },
      });

      continue;
    }

    if (!deepEquals(oldStructure.structure, newStructure)) {
      serviceLogger.info('Migrating %s', id);

      await migrateEntityCollection(id, descriptor.schema);

      ops.push({
        updateOne: {
          filter: { entityId: id },
          update: { $set: { structure: newStructure } },
        },
      });
    }
  }

  if (ops.length > 0) {
    await col.bulkWrite(ops);
  }
}

export default service({
  lifecycle: {
    onInit: {
      dependsOn: ['base::database', 'base::entitySchema'],
      action: async () => {
        await migrate();
      },
    },
  },
});
