import { EntitySchema } from '@game-cms/base-core';
import { isNonNullObject } from '@game-cms/shared';

export function shallowValidateEntitySchema(
  value: unknown
): value is EntitySchema {
  if (!isNonNullObject(value)) {
    return false;
  }

  const { title, components } = value;

  if (typeof title !== 'string' || !isNonNullObject(components)) {
    return false;
  }

  return true;
}

export function shallowValidateEntitySchemaMap(
  value: unknown
): value is Record<string, EntitySchema> {
  return (
    isNonNullObject(value) &&
    // eslint-disable-next-line unicorn/no-array-callback-reference
    Object.values(value).every(shallowValidateEntitySchema)
  );
}
