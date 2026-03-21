import type { EntityId } from '@game-cms/base-core';
import {
  entityMetaMap,
  getClientContextRegistry,
} from 'virtual:dashboard/entityConnectorData';

export function getEntityIds() {
  return Object.keys(entityMetaMap);
}

export function getEntityTitle(id: EntityId) {
  return entityMetaMap[id].title;
}

export async function getEntitySharedContext(id: EntityId) {
  const registry = await getClientContextRegistry();

  return registry[id];
}
