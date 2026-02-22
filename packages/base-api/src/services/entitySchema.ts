import type { EntityId, EntitySchemaById } from '@game-cms/base-core';
import { service } from '@game-cms/core';
import { env } from '@game-cms/global';

export default service({
  id: 'base::entitySchema',
  getById<Id extends EntityId>(id: Id) {
    const result = env().entity.registry[id] ?? null;

    return result as unknown as EntitySchemaById<Id> | null;
  },
  getAll() {
    return env().entity.registry;
  },
});
