import {
  EntityClientSchema,
  EntityDisplayKeyById,
  EntityId,
} from '@game-cms/base-core';

const DEFAULT_KEYS = ['id'];

export function getEntityDisplayKeys(schema: EntityClientSchema) {
  return (
    schema.displayKeys?.slice(0, 5) ??
    (DEFAULT_KEYS as EntityDisplayKeyById<EntityId>[])
  );
}
