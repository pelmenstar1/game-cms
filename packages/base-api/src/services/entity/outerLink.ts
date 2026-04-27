import {
  EntityId,
  EntityPersistentDocumentById,
  EntitySchemaById,
  EntityStorageDataById,
  EntityVariant,
} from '@game-cms/base-core';
import {
  ComponentSchema,
  ReferenceableHandleDescriptor,
  service,
} from '@game-cms/core';
import { cms } from '@game-cms/global';
import { mapObject } from '@game-cms/shared/object';
import { Document } from 'mongodb';

declare module '@game-cms/base-core' {
  interface JobTypeRegistry {
    'base::entity::deleteOuterLink': {
      data: {
        descriptor: ReferenceableHandleDescriptor;
      };
    };
  }
}

function isOuterLinkUsedInEntityVariant<Id extends EntityId>(
  schema: EntitySchemaById<Id>,
  data: EntityStorageDataById<Id>,
  descriptor: ReferenceableHandleDescriptor
) {
  const { foreignOuterLinkContext } = cms().service('base::component');

  return Object.entries<ComponentSchema>(schema.components).some(
    ([key, componentSchema]) => {
      const { componentId, options } = componentSchema;

      return foreignOuterLinkContext.contains(
        descriptor,
        componentId,
        data.components[key],
        options
      );
    }
  );
}

function isOuterLinkUsedInEntity<Id extends EntityId>(
  schema: EntitySchemaById<Id>,
  data: EntityPersistentDocumentById<Id>,
  descriptor: ReferenceableHandleDescriptor
) {
  return (
    isOuterLinkUsedInEntityVariant(schema, data.draft, descriptor) ||
    (data.published &&
      isOuterLinkUsedInEntityVariant(schema, data.published, descriptor))
  );
}

function removeOuterLinkFromEntityData<Id extends EntityId>(
  descriptor: ReferenceableHandleDescriptor,
  schema: EntitySchemaById<Id>,
  data: EntityStorageDataById<Id>
) {
  const { foreignOuterLinkContext } = cms().service('base::component');

  return mapObject(schema.components, (componentSchema, key) => {
    const componentData = data.components[key];
    const { componentId, options } = componentSchema;

    return foreignOuterLinkContext.delete(
      descriptor,
      componentId,
      componentData,
      options
    );
  });
}

function documentVariantToSetter<Id extends EntityId>(
  doc: EntityPersistentDocumentById<Id>,
  schema: EntitySchemaById<Id>,
  descriptor: ReferenceableHandleDescriptor,
  variant: EntityVariant,
  setter: Document
): boolean {
  const variantData = doc[variant];

  if (!variantData) {
    return false;
  }

  if (!isOuterLinkUsedInEntityVariant(schema, variantData, descriptor)) {
    return false;
  }

  const newData = removeOuterLinkFromEntityData(
    descriptor,
    schema,
    variantData
  );

  const searchIndex = cms()
    .service('base::entity::search')
    .createIndex(newData, schema);

  setter[`${variant}.components`] = newData;
  setter[`${variant}.search`] = searchIndex;

  return true;
}

async function removeOuterLinkFromEntityCollection<Id extends EntityId>(
  descriptor: ReferenceableHandleDescriptor,
  entityId: Id,
  schema: EntitySchemaById<Id>
) {
  const col = cms().service('base::database').entityCollection(entityId);

  for await (const doc of col.find()) {
    const { _id } = doc;

    let needsToBeUpdated = false;
    const set: Document = {};

    needsToBeUpdated = documentVariantToSetter(
      doc,
      schema,
      descriptor,
      'draft',
      set
    );

    needsToBeUpdated ||= documentVariantToSetter(
      doc,
      schema,
      descriptor,
      'published',
      set
    );

    if (needsToBeUpdated) {
      await col.updateOne({ _id }, { $set: set });
    }
  }
}

async function removeOuterLinkFromEntities(
  descriptor: ReferenceableHandleDescriptor
) {
  const entityService = cms().service('base::entitySchema');

  const schemas = entityService.getAll();

  await Promise.all(
    Object.entries(schemas).map(async ([id, { schema }]) =>
      removeOuterLinkFromEntityCollection(descriptor, id, schema)
    )
  );
}

export default service({
  lifecycle: {
    onInit: {
      dependsOn: [
        'base::appEvents',
        'base::job',
        'base::referenceableOrchestrator',
      ],
      action: () => {
        const jobService = cms().service('base::job');

        jobService.registerJob('base::entity::deleteOuterLink', {
          retry: {
            count: 3,
            delay: 1000,
          },
          execute: async ({ descriptor }) => {
            await removeOuterLinkFromEntities(descriptor);
          },
        });

        cms()
          .service('base::referenceableOrchestrator')
          .onDeleted((descriptor) => {
            void jobService.postJob({
              type: 'base::entity::deleteOuterLink',
              data: { descriptor },
            });
          });
      },
    },
  },
  isOuterLinkUsedInEntity,
});
