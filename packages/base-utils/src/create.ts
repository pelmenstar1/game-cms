import type {
  EntitySchema,
  EntitySchemaComponents,
} from '@game-cms/base-types';

/*@__NO_SIDE_EFFECTS__*/
export function entity<
  Id extends string,
  const Components extends EntitySchemaComponents,
>(value: EntitySchema<Id, Components>) {
  return value;
}
