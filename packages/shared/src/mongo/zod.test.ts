import { ObjectId } from 'mongodb';
import { describe, expect, test } from 'vitest';
import z from 'zod';

import { stringObjectId } from './zod.js';

const validId = '507f1f77bcf86cd799439011';

describe('stringObjectId', () => {
  test('parses a valid hex string into ObjectId', () => {
    const result = stringObjectId.parse(validId);

    expect(result).toBeInstanceOf(ObjectId);
    expect(result.toHexString()).toBe(validId);
  });

  test('rejects a non-string input', () => {
    expect(() => stringObjectId.parse(123)).toThrow();
  });

  test('rejects an invalid ObjectId string', () => {
    expect(() => stringObjectId.parse('not-an-object-id')).toThrow();
  });

  describe('inside a union with objectId', () => {
    const literalValue = '123';

    const schema = z.union([stringObjectId, z.literal(literalValue)]);

    test('parses a hex string', () => {
      const result = schema.parse(validId);

      expect(result).toBeInstanceOf(ObjectId);
    });

    test('passes though literal', () => {
      const result = schema.parse(literalValue);

      expect(result).toBe(literalValue);
    });
  });
});
