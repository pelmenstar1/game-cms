import type { EntityDescriptor, EntityId } from '@game-cms/base-core';
import { service } from '@game-cms/core';
import { env } from '@game-cms/global';

function getEntry<Id extends EntityId>(id: Id) {
  return env().entity.registry[id] as unknown as
    | EntityDescriptor<Id>
    | undefined;
}

export default service({
  id: 'base::entitySchema',
  getEntry,
  getSchemaById<Id extends EntityId>(id: Id) {
    return getEntry(id)?.schema.value ?? null;
  },
  getBackContextById(id: EntityId) {
    return getEntry(id)?.backContext ?? null;
  },
  getAll() {
    return env().entity.registry;
  },
});
