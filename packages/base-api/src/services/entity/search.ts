import {
  BaseEntityStorageDataById,
  EntityId,
  EntitySchemaById,
  EntitySearchIndexDataById,
} from '@game-cms/base-core';
import { service } from '@game-cms/core';
import { cms } from '@game-cms/global';
import { asyncMapObject } from '@game-cms/shared/object';

function createIndex<Id extends EntityId>(
  storageData: BaseEntityStorageDataById<Id>,
  schema: EntitySchemaById<Id>
): Promise<EntitySearchIndexDataById<Id>> {
  const { foreignDataSearchContext } = cms().service('base::component');

  return asyncMapObject(schema.components, (component, key) => {
    const { componentId, options } = component;

    return foreignDataSearchContext.createSearchIndex(
      componentId,
      storageData[key],
      options
    );
  });
}

export default service({
  lifecycle: {},
  createIndex,
});
