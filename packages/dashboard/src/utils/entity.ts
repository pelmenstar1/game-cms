import {
  EntityDisplayKeyById,
  EntityId,
  EntitySchema,
} from '@game-cms/base-core';

const DEFAULT_KEYS = ['_id'];

export function getEntityDisplayKeys<Id extends EntityId>(
  schema: EntitySchema<Id>
) {
  return (
    schema.displayKeys?.slice(0, 5) ??
    (DEFAULT_KEYS as EntityDisplayKeyById<Id>[])
  );
}
