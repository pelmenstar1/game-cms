import {
  ComponentDataSearchTarget,
  ComponentNestedPath,
  ComponentNestedPathExtends,
  ComponentRawInDataById,
  ComponentSchema,
  ComponentSearchIndexDataById,
  ComponentStorageDataById,
  ParseComponentNestedPath,
} from '@game-cms/core';
import { expectTypeOf, test } from 'vitest';

import { compose } from '../Compose/index.js';
import { file } from '../File/index.js';
import { number } from '../Number/index.js';
import { text } from '../Text/index.js';
import { repeatable } from './index.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const schema = repeatable({
  component: compose({
    image: file(),
    name: text(),
    bundle: text(),
    nested: compose({
      abc: number(),
    }),
  }),
});

type Schema = typeof schema;
type Id = Schema extends ComponentSchema<infer R> ? R : never;
type Args = Schema extends ComponentSchema<string, infer R> ? R : never;
type Data = ComponentRawInDataById<Id, Args>;

test('ComponentNestedPath', () => {
  type Actual = ComponentNestedPath<Data, Id, Args>;

  expectTypeOf<Actual>().toEqualTypeOf<
    'name' | 'image' | 'bundle' | 'nested' | 'nested.abc'
  >();
});

test('ParseComponentNestedPath', () => {
  type Actual = ParseComponentNestedPath<Data, 'name', Id, Args>;

  expectTypeOf<Actual>().toEqualTypeOf<string>();
});

test('ComponentNestedPathExtends', () => {
  type Actual = ComponentNestedPathExtends<Data, string, Id, Args>;

  expectTypeOf<Actual>().toEqualTypeOf<'name' | 'bundle'>();
});

test('ComponentDataSearchTarget', () => {
  type Target = ComponentDataSearchTarget<Id, Args>;

  expectTypeOf<Target>().toExtend<{
    storage: ComponentStorageDataById<Id, Args>;
    searchIndex: ComponentSearchIndexDataById<Id, Args>;
  }>();
});
