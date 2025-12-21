import type { ServerEntitySchema } from '@game-cms/base-types';
import type { ComponentData } from '@game-cms/types';

/*@__NO_SIDE_EFFECTS__*/
export function entity<
  T extends Record<string, ComponentData>,
  Id extends string,
>(value: ServerEntitySchema<T, Id>) {
  return value;
}
