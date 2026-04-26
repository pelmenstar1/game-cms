import {
  AbortOptions,
  EntityId,
  EntityInternalOutDataById,
  EntitySchemaById,
  StorageItemType,
} from '@game-cms/base-core';
import { ReferenceableHandleDescriptor, service } from '@game-cms/core';
import { cms } from '@game-cms/global';
import { ObjectId } from 'mongodb';

async function traceFileInEntityCollection<Id extends EntityId>(
  entityId: Id,
  schema: EntitySchemaById<Id>,
  fileRef: ReferenceableHandleDescriptor<'base::storageItem'>,
  options?: AbortOptions
) {
  const signal = options?.signal;
  const cursor = cms()
    .service('base::database')
    .entityCollection(entityId)
    .find();

  const outerLinkService = cms().service('base::entity::outerLink');
  const entityService = cms().service('base::entity');

  const result: EntityInternalOutDataById<Id>[] = [];

  for await (const document of cursor) {
    signal?.throwIfAborted();

    if (outerLinkService.isOuterLinkUsedInEntity(schema, document, fileRef)) {
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
  traceFile: async (fileId: ObjectId, options?: AbortOptions) => {
    const fileRef: ReferenceableHandleDescriptor<'base::storageItem'> = {
      id: 'base::storageItem',
      data: {
        id: fileId,
        type: StorageItemType.FILE,
      },
    };

    await cms().service('base::storage').ensureFileItemById(fileId, options);

    const schemas = cms().service('base::entitySchema').getAll();

    const result = await Promise.all(
      Object.entries(schemas).map(async ([entityId, { schema }]) => {
        const result = await traceFileInEntityCollection(
          entityId,
          schema,
          fileRef,
          options
        );

        return result.map((document) => ({ entityId, document }));
      })
    );

    return result.flat();
  },
});
