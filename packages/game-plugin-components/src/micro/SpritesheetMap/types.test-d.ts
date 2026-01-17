import type { SpritesheetData } from 'pixi.js';
import { expectTypeOf, test } from 'vitest';

import type { SpritesheetDataWithSize } from './types';

test('SpritesheetDataWithSize', () => {
  type ExpectedType = Pick<SpritesheetData, 'frames' | 'meta'>;

  expectTypeOf<SpritesheetDataWithSize>().toExtend<ExpectedType>();
});
