import type { EntityId, EntitySchemaById } from '@game-cms/base-core';
import { service } from '@game-cms/core';
import { env } from '@game-cms/global';

function getById<Id extends EntityId>(id: Id) {
  const { entitySchemas } = env();

  const result = entitySchemas.find((schema) => schema.id === id);

  return (result ?? null) as EntitySchemaById<Id> | null;
}

export default service({
  id: 'base::entitySchema',
  getById,
  getAll() {
    return env().entitySchemas;
  },
});
