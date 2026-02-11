import {
  ComponentNestedPath,
  ComponentNestedPathShape,
  ComponentRawDataById,
  ComponentRawInDataByIdPath,
  ComponentSchema,
  ParseComponentNestedPath,
} from '@game-cms/core';
import { describe, expectTypeOf, test } from 'vitest';

test('raw data', () => {
  type RawData = ComponentRawDataById<
    'base::compose',
    {
      abc: ComponentSchema<'base::text'>;
    }
  >;

  expectTypeOf<RawData>().toExtend<{ abc: string }>();
});

describe('nested path', () => {
  test('with args', () => {
    type Path = ComponentRawInDataByIdPath<
      'base::compose',
      {
        abc: ComponentSchema<'base::text'>;
        abc2: ComponentSchema<
          'base::compose',
          {
            nested1: ComponentSchema<'base::text'>;
          }
        >;
      }
    >;

    expectTypeOf<Path>().toEqualTypeOf<'abc' | 'abc2' | 'abc2.nested1'>();
  });

  test('no args', () => {
    type Path = ComponentNestedPath<unknown, 'base::compose'>;

    expectTypeOf<Path>().toEqualTypeOf<string>();
  });
});

test('nested path shape', () => {
  type Shape = ComponentNestedPathShape<
    'base::compose',
    {
      a: ComponentSchema<'base::text'>;
      b: ComponentSchema<'base::compose', { c: ComponentSchema<'base::text'> }>;
    }
  >;

  expectTypeOf<Shape>().toEqualTypeOf<{ a: unknown; b: { c: unknown } }>();
});

test('parse nested path', () => {
  type Result = ParseComponentNestedPath<
    { a: { b: 1 } },
    'a.b',
    'base::compose',
    {
      a: ComponentSchema<
        'base::compose',
        { b: ComponentSchema<'base::number'> }
      >;
    }
  >;

  expectTypeOf<Result>().toEqualTypeOf<1>();
});
