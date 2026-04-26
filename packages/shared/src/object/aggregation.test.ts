import { describe, expect, test } from 'vitest';

import { objectAggregation } from './aggregation.js';

describe('objectAggregation', () => {
  describe('result', () => {
    test('returns original object when no ops applied', () => {
      const input = { a: 1, b: 2, c: 3 };
      expect(objectAggregation(input).result()).toEqual(input);
    });

    test('returns empty object for empty input', () => {
      expect(objectAggregation({}).result()).toEqual({});
    });
  });

  describe('filter', () => {
    test('keeps entries matching predicate', () => {
      const result = objectAggregation({ a: 1, b: 2, c: 3 })
        .filter((v) => v > 1)
        .result();
      expect(result).toEqual({ b: 2, c: 3 });
    });

    test('returns empty object when all entries filtered out', () => {
      const result = objectAggregation({ a: 1, b: 2 })
        .filter(() => false)
        .result();
      expect(result).toEqual({});
    });

    test('returns full object when no entries filtered out', () => {
      const input = { a: 1, b: 2 };
      const result = objectAggregation(input)
        .filter(() => true)
        .result();
      expect(result).toEqual(input);
    });

    test('predicate receives correct key and value', () => {
      const calls: [string, unknown][] = [];
      objectAggregation({ x: 10, y: 20 })
        .filter((v, k) => {
          calls.push([k, v]);
          return true;
        })
        .result();

      expect(calls).toEqual(
        expect.arrayContaining([
          ['x', 10],
          ['y', 20],
        ])
      );
    });
  });

  describe('map', () => {
    test('transforms values via fn', () => {
      const result = objectAggregation({ a: 1, b: 2 })
        .map<number>((v) => v * 10)
        .result();
      expect(result).toEqual({ a: 10, b: 20 });
    });

    test('returns empty object for empty input', () => {
      const result = objectAggregation({})
        .map<number>((v) => v)
        .result();
      expect(result).toEqual({});
    });
  });

  describe('chaining', () => {
    test('filter then map', () => {
      const result = objectAggregation({ a: 1, b: 2, c: 3 })
        .filter((v) => v > 1)
        .map<number>((v) => v * 10)
        .result();
      expect(result).toEqual({ b: 20, c: 30 });
    });

    test('map then filter', () => {
      const result = objectAggregation({ a: 1, b: 2, c: 3 })
        .map<number>((v) => v * 10)
        .filter((v) => v > 15)
        .result();
      expect(result).toEqual({ b: 20, c: 30 });
    });

    test('multiple maps compose in order', () => {
      const result = objectAggregation({ a: 1, b: 2 })
        .map<number>((v) => v + 1)
        .map<number>((v) => v * 2)
        .result();
      expect(result).toEqual({ a: 4, b: 6 });
    });

    test('multiple filters compose in order', () => {
      const result = objectAggregation({ a: 1, b: 2, c: 3, d: 4 })
        .filter((v) => v > 1)
        .filter((v) => v < 4)
        .result();
      expect(result).toEqual({ b: 2, c: 3 });
    });
  });
});
