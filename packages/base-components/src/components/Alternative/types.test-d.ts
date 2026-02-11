import {
  ComponentNestedPath,
  ComponentRawInDataById,
  GetComponentSchemaArgs,
  GetComponentSchemaId,
} from '@game-cms/core';
import { expectTypeOf, test } from 'vitest';

import { compose, file, number, text } from '../../index.js';
import { alternative } from './index.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const schema = alternative(
  compose({
    image: file(),
    name: text(),
    bundle: text(),
    nested: compose({
      abc: number(),
    }),
  })
);

type Schema = typeof schema;
type Id = GetComponentSchemaId<Schema>;
type Args = GetComponentSchemaArgs<Schema>;
type Data = ComponentRawInDataById<Id, Args>;

test('ComponentNestedPath', () => {
  type Actual = ComponentNestedPath<Data, Id, Args>;

  expectTypeOf<Actual>().toEqualTypeOf<
    'name' | 'image' | 'bundle' | 'nested' | 'nested.abc'
  >();
});
