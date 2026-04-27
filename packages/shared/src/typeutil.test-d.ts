import { expectTypeOf, test } from 'vitest';

import type {
  AnyKeyInObject,
  BooleanOr,
  ConditionalPartial,
  FromEntries,
  IsAllOptional,
  Or,
  UnionToIntersection,
  UnpackArray,
} from './typeutil.js';

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

test('ConditionalPartial', () => {
  expectTypeOf<
    ConditionalPartial<{
      a: { optional: true; value: 1 };
      b: { optional: false; value: 2 };
    }>
  >().toExtend<{ a?: 1; b: 2 }>();
});

test('Or', () => {
  type Result = Or<{ a: string }, { b: number }>;

  expectTypeOf<Result>().toExtend<
    { a: string; b?: undefined } | { a?: undefined; b: number }
  >();
});

test('UnpackArray', () => {
  expectTypeOf<UnpackArray<string[]>>().toEqualTypeOf<string>();
  expectTypeOf<UnpackArray<string | number>>().toEqualTypeOf<string | number>();
});

test('FromEntries', () => {
  expectTypeOf<FromEntries<['a', string]>>().toEqualTypeOf<{
    a: string;
  }>();

  expectTypeOf<FromEntries<['a', string] | ['b', number]>>().toEqualTypeOf<{
    a: string;
    b: number;
  }>();
});

test('UnionToIntersection', () => {
  expectTypeOf<UnionToIntersection<{ a: string }>>().toEqualTypeOf<{
    a: string;
  }>();

  expectTypeOf<
    UnionToIntersection<{ a: string } | { b: number }>
  >().toEqualTypeOf<{ a: string } & { b: number }>();
});

test('BooleanOr', () => {
  expectTypeOf<BooleanOr<true, true>>().toEqualTypeOf<true>();
  expectTypeOf<BooleanOr<true, false>>().toEqualTypeOf<true>();
  expectTypeOf<BooleanOr<false, true>>().toEqualTypeOf<true>();
  expectTypeOf<BooleanOr<false, false>>().toEqualTypeOf<false>();
});
