import {
  EntityCheckClientController,
  EntityCheckClientOptions,
  EntityCheckId,
} from '@game-cms/base-core';
import entityCheckData from 'virtual:dashboard/entityCheckConnectorData';

export const entityCheckIds = Object.keys(entityCheckData);

export function getEntityCheckOptions<Id extends EntityCheckId>(id: Id) {
  return entityCheckData[id]?.options as
    EntityCheckClientOptions<Id> | undefined;
}

export async function getEntityCheckClientController<Id extends EntityCheckId>(
  id: Id
) {
  const controller = entityCheckData[id]?.controller;

  if (controller) {
    const module = await controller();

    return module.default as unknown as EntityCheckClientController<Id>;
  }
}
