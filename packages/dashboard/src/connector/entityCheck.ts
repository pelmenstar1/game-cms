import { EntityCheckId, EntityCheckRenderer } from '@game-cms/base-core';
import entityCheckData from 'virtual:dashboard/entityCheckConnectorData';

export async function getEntityCheckRenderer<Id extends EntityCheckId>(
  id: Id
): Promise<EntityCheckRenderer<Id> | undefined> {
  const portal = entityCheckData[id];

  if (portal) {
    const module = await portal();

    return module.default as unknown as EntityCheckRenderer<Id>;
  }
}
