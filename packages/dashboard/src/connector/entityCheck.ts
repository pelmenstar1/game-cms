import {
  EntityCheckClientController,
  EntityCheckId,
} from '@game-cms/base-core';
import entityCheckData from 'virtual:dashboard/entityCheckConnectorData';

export const entityCheckIds = Object.keys(entityCheckData);

export async function getEntityCheckClientController<Id extends EntityCheckId>(
  id: Id
) {
  const portal = entityCheckData[id];

  if (portal) {
    const module = await portal();

    return module.default as unknown as EntityCheckClientController<Id>;
  }
}
