import {
  EntityId,
  EntitySchemaById,
  EntityStorageDataById,
  StorageItemType,
} from '@game-cms/base-core';
import { ComponentAtomWalkerPredicateFn, service } from '@game-cms/core';
import { cms } from '@game-cms/global';
import { mapObject } from '@game-cms/shared/object';
import { ObjectId } from 'mongodb';

declare module '@game-cms/base-core' {
  interface JobTypeRegistry {
    'base::entity::filterFiles': {
      data: {
        fileId: ObjectId;
      };
    };
  }
}

function removeFileFromEntityData<Id extends EntityId>(
  fileId: ObjectId,
  entityId: Id,
  schema: EntitySchemaById<Id>,
  data: EntityStorageDataById<Id>
) {
  const { foreignAtomWalkerContext } = cms().service('base::component');

  const predicate: ComponentAtomWalkerPredicateFn = (id, data) => {
    if (id === 'base::file') {
      const fileData = data as ObjectId[];

      return !fileData.some((id) => id.equals(fileId));
    }

    return true;
  };

  return mapObject(schema.components, (componentSchema, key) => {
    const componentData = data.components[key];
    const { componentId, options } = componentSchema;

    if (!predicate(componentId, componentData, options)) {
      return foreignAtomWalkerContext.getDefaultData(componentId, options);
    }

    return foreignAtomWalkerContext.filter(
      componentId,
      componentData,
      options,
      predicate
    );
  });
}

async function removeFileFromEntityCollection<Id extends EntityId>(
  fileId: ObjectId,
  entityId: Id,
  schema: EntitySchemaById<Id>
) {
  const col = cms().service('base::database').entityCollection(entityId);

  for await (const doc of col.find()) {
    const { _id, draft, published } = doc;

    await col.updateOne(
      { _id },
      {
        'draft.components': removeFileFromEntityData(
          fileId,
          entityId,
          schema,
          draft
        ),
        'published.components': published
          ? removeFileFromEntityData(fileId, entityId, schema, published)
          : undefined,
      }
    );
  }
}

async function removeFileFromEntities(fileId: ObjectId) {
  const entityService = cms().service('base::entitySchema');

  const schemas = entityService.getAll();

  await Promise.all(
    Object.entries(schemas).map(async ([id, { schema }]) =>
      removeFileFromEntityCollection(fileId, id, schema)
    )
  );
}

export default service({
  lifecycle: {
    onInit: {
      dependsOn: ['base::appEvents', 'base::job'],
      action: () => {
        const jobService = cms().service('base::job');

        jobService.registerJob('base::entity::filterFiles', {
          retry: {
            count: 3,
            delay: 1000,
          },
          execute: async ({ fileId }) => {
            await removeFileFromEntities(fileId);
          },
        });

        cms()
          .service('base::appEvents')
          .addHook('base::storage::itemDeleted', ({ id, type }) => {
            if (type === StorageItemType.FILE) {
              void jobService.postJob({
                type: 'base::entity::filterFiles',
                data: { fileId: id },
              });
            }
          });
      },
    },
  },
});
