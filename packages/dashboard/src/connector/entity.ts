import type { EntityId } from '@game-cms/base-core';
import { fullEntityMap, metaMap } from 'virtual:dashboard/entityConnectorData';

export function getEntityMetaMap() {
  return metaMap;
}

export async function getEntitySchemaById<Id extends EntityId>(id: Id) {
  const { default: result } = await fullEntityMap[id]();

  return result;
}
