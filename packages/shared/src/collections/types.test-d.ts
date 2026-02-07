import { expectTypeOf, test } from 'vitest';

import type { SizedIterable } from './types.js';

test('SizedIterable', () => {
  expectTypeOf<number[]>().toExtend<SizedIterable<number>>();
  expectTypeOf<Set<string>>().toExtend<SizedIterable<string>>();
});
