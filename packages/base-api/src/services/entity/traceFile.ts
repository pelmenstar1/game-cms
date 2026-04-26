import {
  EntityId,
  EntityInternalOutDataById,
  EntityPersistentDocumentById,
  EntitySchemaById,
  StorageItemType,
} from '@game-cms/base-core';
import {
  ComponentSchema,
  ReferenceableHandleDescriptor,
  service,
} from '@game-cms/core';
import { ApiError } from '@game-cms/core/api';
import { cms } from '@game-cms/global';
import { ObjectId } from 'mongodb';

async function checkFile(fileId: ObjectId, signal?: AbortSignal) {
  const item = await cms()
    .service('base::storage')
    .collection()
    .findOne({ _id: fileId }, { projection: { type: 1 }, signal });

  if (item === null) {
    throw new ApiError('File does not exist', {
      code: 'base::entity/notFound',
    });
  }

  if (item.type !== StorageItemType.FILE) {
    throw new ApiError('Storage item expected to be a file', {
      code: 'base::schema/validation',
    });
  }
}

function isFileUsedInEntity<Id extends EntityId>(
  schema: EntitySchemaById<Id>,
  data: EntityPersistentDocumentById<Id>,
  fileRef: ReferenceableHandleDescriptor<'base::storageItem'>
): boolean {
  const { foreignOuterLinkContext } = cms().service('base::component');

  return Object.entries<ComponentSchema>(schema.components).some(
    ([key, componentSchema]) => {
      const { componentId, options } = componentSchema;
      const componentData = data.draft.components[key];

      if (
        foreignOuterLinkContext.contains(
          fileRef,
          componentId,
          componentData,
          options
        )
      ) {
        return true;
      }

      if (data.published) {
        const publishedComponentData = data.published.components[key];

        if (
          foreignOuterLinkContext.contains(
            fileRef,
            componentId,
            publishedComponentData,
            options
          )
        ) {
          return true;
        }
      }

      return false;
    }
  );
}

async function traceFileInEntityCollection<Id extends EntityId>(
  entityId: Id,
  schema: EntitySchemaById<Id>,
  fileRef: ReferenceableHandleDescriptor<'base::storageItem'>
) {
  const cursor = cms()
    .service('base::database')
    .entityCollection(entityId)
    .find();

  const entityService = cms().service('base::entity');

  const result: EntityInternalOutDataById<Id>[] = [];

  for await (const document of cursor) {
    if (isFileUsedInEntity(schema, document, fileRef)) {
      const outDraft = await entityService.storageDataToOut({
        entityId,
        documentId: document._id,
        documentVariant: 'draft',
        storageData: document.draft,
      });

      result.push(outDraft);
    }
  }

  return result;
}

export default service({
  lifecycle: {},
  traceFile: async (fileId: ObjectId) => {
    await checkFile(fileId);

    const fileRef: ReferenceableHandleDescriptor<'base::storageItem'> = {
      id: 'base::storageItem',
      data: {
        id: fileId,
        type: StorageItemType.FILE,
      },
    };

    const schemas = cms().service('base::entitySchema').getAll();

    const result = await Promise.all(
      Object.entries(schemas).map(async ([entityId, { schema }]) => {
        const result = await traceFileInEntityCollection(
          entityId,
          schema,
          fileRef
        );

        return result.map((document) => ({ entityId, document }));
      })
    );

    return result.flat();
  },
});
