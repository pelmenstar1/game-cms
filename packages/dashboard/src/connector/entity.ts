import type { EntityId, EntitySchemaById } from '@game-cms/base-core';
import data from 'virtual:dashboard/entityConnectorData';

export function getEntitySchemas() {
  return Object.values(data);
}

export function getEntitySchemaById<Id extends EntityId>(
  id: Id
): EntitySchemaById<Id> {
  return data[id];
}
