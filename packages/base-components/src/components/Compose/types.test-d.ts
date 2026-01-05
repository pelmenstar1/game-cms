import { ComponentRawDataById, ComponentSchema } from '@game-cms/core';
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
