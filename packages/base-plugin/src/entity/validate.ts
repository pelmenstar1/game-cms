import { EntitySchema } from '@game-cms/base-core';
import { isNonNullObject } from '@game-cms/shared';

export function validateEntitySchema(
  value: unknown,
  id: string
): asserts value is EntitySchema {
  if (!isNonNullObject(value)) {
    throw new TypeError(`Invalid entity schema (${id}): expected an object`);
  }

  const { title, components } = value;

  if (typeof title !== 'string') {
    throw new TypeError(
      `Invalid entity schema (${id}): 'title' must be a string`
    );
  }

  if (!isNonNullObject(components)) {
    throw new TypeError(
      `Invalid entity schema (${id}): 'components' must be an object`
    );
  }
}

export function validateEntitySchemaMap(
  value: unknown
): asserts value is Record<string, EntitySchema> {
  if (!isNonNullObject(value)) {
    throw new TypeError('Invalid entity schema map: expected an object');
  }

  for (const [id, schema] of Object.entries(value)) {
    validateEntitySchema(schema, id);
  }
}
