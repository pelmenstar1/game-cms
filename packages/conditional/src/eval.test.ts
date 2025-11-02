import { expect, test } from 'vitest';

import type { ConditionalAstExpression } from './ast.js';
import { evaluateConditionalExpression } from './eval.js';
import type {
  ConditionalValueInput,
  ConditionalValueInputAtom,
} from './types.js';

test.each<
  [ConditionalAstExpression, ConditionalValueInput, ConditionalValueInputAtom]
>([
  [{ $type: 'literal', value: '123' }, {}, '123'],
  [{ $type: 'var', name: 'abc' }, { abc: '123' }, '123'],
  [
    {
      $type: 'binary',
      operator: 'eq',
      lhs: { $type: 'var', name: 'abc' },
      rhs: { $type: 'literal', value: '123' },
    },
    { abc: '123' },
    true,
  ],
  [
    {
      $type: 'binary',
      operator: 'lt',
      lhs: { $type: 'var', name: 'abc' },
      rhs: { $type: 'literal', value: '123' },
    },
    { abc: 124 },
    false,
  ],
])('eval', (expression, input, expected) => {
  const actual = evaluateConditionalExpression(expression, input);

  expect(actual).toEqual(expected);
});
