import {
  EntityId,
  EntityInternalOutDataById,
  EntityPersistentDocumentById,
  EntitySchemaById,
  StorageItemType,
} from '@game-cms/base-core';
import { ComponentAtomWalkerApplyFn, service } from '@game-cms/core';
import { ApiError } from '@game-cms/core/api';
import { cms } from '@game-cms/global';
import { ObjectId } from 'mongodb';

async function checkFile(fileId: ObjectId, signal?: AbortSignal) {
  const item = await cms()
    .service('base::storage')
    .collection()
    .findOne(
      {
        _id: fileId,
      },
      { projection: { type: 1 }, signal }
    );

  if (item === null) {
    throw new ApiError('File does not exist', 'base::entity/notFound');
  }

  if (item.type !== StorageItemType.FILE) {
    throw new ApiError(
      'Storage item expected to be a file',
      'base::schema/validation'
    );
  }
}

function isFileUsedInEntity<Id extends EntityId>(
  schema: EntitySchemaById<Id>,
  data: EntityPersistentDocumentById<Id>,
  fileId: ObjectId
): boolean {
  const { foreignAtomWalkerContext } = cms().service('base::component');

  let result = false;

  const apply: ComponentAtomWalkerApplyFn = (atomId, atomData) => {
    if (atomId === 'base::file') {
      const fileData = atomData as ObjectId[];

      result ||= fileData.some((id) => id.equals(fileId));
    }
  };

  for (const [key, componentSchema] of Object.entries(schema.components)) {
    const { componentId, options } = componentSchema;

    foreignAtomWalkerContext.walk(
      componentId,
      data.draft.components[key],
      options,
      apply
    );

    if (data.published) {
      foreignAtomWalkerContext.walk(
        componentId,
        data.published.components[key],
        options,
        apply
      );
    }
  }

  return result;
}

async function traceFileInEntityCollection<Id extends EntityId>(
  entityId: Id,
  schema: EntitySchemaById<Id>,
  fileId: ObjectId
) {
  const cursor = cms()
    .service('base::database')
    .entityCollection(entityId)
    .find(
      {},
      { projection: { draft: { components: 1 }, published: { components: 1 } } }
    );

  const entityService = cms().service('base::entity');

  const result: EntityInternalOutDataById<Id>[] = [];

  for await (const document of cursor) {
    if (isFileUsedInEntity(schema, document, fileId)) {
      const outDraft = await entityService.storageDataToOut(
        entityId,
        document._id,
        document.draft
      );

      result.push(outDraft);
    }
  }

  return result;
}

export default service({
  id: 'base::storage::trace',
  traceFile: async (fileId: ObjectId) => {
    await checkFile(fileId);

    const schemas = cms().service('base::entitySchema').getAll();

    const result = await Promise.all(
      Object.entries(schemas).map(async ([entityId, descriptor]) => {
        const result = await traceFileInEntityCollection(
          entityId,
          descriptor.schema.value,
          fileId
        );

        return result.map((document) => ({ entityId, document }));
      })
    );

    return result.flat();
  },
});
