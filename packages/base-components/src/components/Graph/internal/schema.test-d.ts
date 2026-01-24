import { ComponentRawInDataById } from '@game-cms/core';
import { expectTypeOf, test } from 'vitest';
import { z } from 'zod/v4-mini';

import { dataShape } from './schema.js';

test('dataShape', () => {
  type DataShapeType = z.infer<typeof dataShape>;

  expectTypeOf<DataShapeType>().toExtend<
    ComponentRawInDataById<'base::graph'>
  >();
});
