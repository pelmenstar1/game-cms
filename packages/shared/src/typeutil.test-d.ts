import { expectTypeOf, test } from 'vitest';

import { type IsAllOptional } from './typeutil.js';

test('IsAllOptional', () => {
  expectTypeOf<IsAllOptional<{ a?: string }>>().toExtend<true>();
  expectTypeOf<IsAllOptional<{ a: string }>>().toExtend<false>();
  expectTypeOf<IsAllOptional<{ a?: string; b: string }>>().toExtend<false>();
});
