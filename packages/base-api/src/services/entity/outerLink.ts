import {
  EntityId,
  EntitySchemaById,
  EntityStorageDataById,
} from '@game-cms/base-core';
import { ReferenceableHandleDescriptor, service } from '@game-cms/core';
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

function removeFileFromEntityData<Id extends EntityId>(
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

async function removeFileFromEntityCollection<Id extends EntityId>(
  descriptor: ReferenceableHandleDescriptor,
  entityId: Id,
  schema: EntitySchemaById<Id>
) {
  const col = cms().service('base::database').entityCollection(entityId);

  for await (const doc of col.find()) {
    const { _id, draft, published } = doc;

    const set: Document = {
      'draft.components': removeFileFromEntityData(descriptor, schema, draft),
    };

    if (published) {
      set['published.components'] = removeFileFromEntityData(
        descriptor,
        schema,
        published
      );
    }

    await col.updateOne({ _id }, { $set: set });
  }
}

async function removeOuterLinkFromEntities(
  descriptor: ReferenceableHandleDescriptor
) {
  const entityService = cms().service('base::entitySchema');

  const schemas = entityService.getAll();

  await Promise.all(
    Object.entries(schemas).map(async ([id, { schema }]) =>
      removeFileFromEntityCollection(descriptor, id, schema)
    )
  );
}

export default service({
  lifecycle: {
    onInit: {
      dependsOn: ['base::appEvents', 'base::job'],
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
});
