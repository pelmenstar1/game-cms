import type { EntityId } from '@game-cms/base-core';
import { fullEntityMap, metaMap } from 'virtual:dashboard/entityConnectorData';

export function getEntityMetaMap() {
  return metaMap;
}

export function getEntitySchemaById<Id extends EntityId>(id: Id) {
  return fullEntityMap[id]();
}
