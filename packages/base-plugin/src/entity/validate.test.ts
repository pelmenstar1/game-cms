import { entity } from '@game-cms/base-core';
import { describe, expect, test } from 'vitest';

import { shallowValidateEntitySchema } from './validate.js';

describe('shallowValidateEntitySchema', () => {
  test('valid schema', () => {
    expect(
      shallowValidateEntitySchema(entity({ title: '2', components: {} }))
    ).toEqual(true);
  });

  test.each([
    [null],
    [undefined],
    [{ a: '1' }],
    [{ title: '2', components: '' }],
  ])('invalid schema', (value) => {
    expect(shallowValidateEntitySchema(value)).toEqual(false);
  });
});
