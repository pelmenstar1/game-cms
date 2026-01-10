import { expectTypeOf, test } from 'vitest';

import type { AnyKeyInObject, IsAllOptional } from './typeutil.js';

test('IsAllOptional', () => {
  expectTypeOf<IsAllOptional<{ a?: string }>>().toExtend<true>();
  expectTypeOf<IsAllOptional<{ a: string }>>().toExtend<false>();
  expectTypeOf<IsAllOptional<{ a?: string; b: string }>>().toExtend<false>();
});

test('AnyKeyInObject', () => {
  expectTypeOf<AnyKeyInObject<{ a: string }, 'a'>>().toEqualTypeOf<true>();
  expectTypeOf<AnyKeyInObject<{ a: string }, 'b'>>().toEqualTypeOf<false>();
  expectTypeOf<AnyKeyInObject<{ a: string }, 'a' | 'b'>>().toExtend<true>();
});
