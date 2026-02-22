import { entity } from '@game-cms/base-core';
import { describe, expect, test } from 'vitest';

import { validateEntitySchema } from '../validate.js';

describe('shallowValidateEntitySchema', () => {
  test('valid schema', () => {
    validateEntitySchema(entity({ title: '2', components: {} }), '123');
  });

  test.each([
    [null],
    [undefined],
    [{ a: '1' }],
    [{ title: '2', components: '' }],
  ])('invalid schema', (value) => {
    expect(() => {
      validateEntitySchema(value, '123');
    }).toThrow(TypeError);
  });
});
