import { GetComponentSchemaTypes } from '@game-cms/core';
import { expectTypeOf, test } from 'vitest';

import { checkbox } from './index.js';

test('data', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const component = checkbox({
    value: {
      title: '123',
    },
  });

  expectTypeOf<GetComponentSchemaTypes<typeof component>['outData']>().toExtend<
    'value'[]
  >();
});
