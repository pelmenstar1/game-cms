import type { EntityId, EntitySchemaById } from '@game-cms/base-core';
import {
  entityMap,
  registryImport,
} from 'virtual:dashboard/entityConnectorData';

export function getEntityIds() {
  return Object.keys(entityMap);
}

export function getEntityTitle(id: EntityId) {
  return entityMap[id].title;
}

export async function getEntitySchemaById<Id extends EntityId>(id: Id) {
  const schemaImport = entityMap[id].schema;

  if (schemaImport) {
    const { default: result } = await schemaImport();

    return result as EntitySchemaById<Id>;
  }

  const registry = await registryImport();

  return registry[id] as EntitySchemaById<Id>;
}
