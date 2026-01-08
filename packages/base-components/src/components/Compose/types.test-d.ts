import {
  ComponentRawDataById,
  ComponentRawInDataByIdPath,
  ComponentSchema,
} from '@game-cms/core';
import { expectTypeOf, test } from 'vitest';

test('raw data', () => {
  type RawData = ComponentRawDataById<
    'base::compose',
    {
      abc: ComponentSchema<'base::text'>;
    }
  >;

  expectTypeOf<RawData>().toExtend<{ abc: string }>();
});

test('nested path', () => {
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

  expectTypeOf<'abc'>().toExtend<Path>();
});
