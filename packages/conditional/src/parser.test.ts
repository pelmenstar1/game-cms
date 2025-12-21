import { expect, test } from 'vitest';

import type { ConditionalAstExpression } from './ast.js';
import { parseConditionalNotation } from './parser.js';

test.each<[string, ConditionalAstExpression]>([
  ['$name', { $type: 'var', name: 'name' }],
  [
    '!$name',
    { $type: 'unary', operator: 'not', expr: { $type: 'var', name: 'name' } },
  ],
  [
    '$name<=123',
    {
      $type: 'binary',
      operator: 'lte',
      lhs: { $type: 'var', name: 'name' },
      rhs: { $type: 'literal', value: '123' },
    },
  ],
  [
    '$name<123',
    {
      $type: 'binary',
      operator: 'lt',
      lhs: { $type: 'var', name: 'name' },
      rhs: { $type: 'literal', value: '123' },
    },
  ],
  [
    '123==321',
    {
      $type: 'binary',
      operator: 'eq',
      lhs: { $type: 'literal', value: '123' },
      rhs: { $type: 'literal', value: '321' },
    },
  ],
  [
    "$abc=='some && text'",
    {
      $type: 'binary',
      operator: 'eq',
      lhs: {
        $type: 'var',
        name: 'abc',
      },
      rhs: {
        $type: 'literal',
        value: 'some && text',
      },
    },
  ],
  [
    '(1 && 2) || 3',
    {
      $type: 'binary',
      operator: 'or',
      lhs: {
        $type: 'binary',
        operator: 'and',
        lhs: { $type: 'literal', value: '1' },
        rhs: { $type: 'literal', value: '2' },
      },
      rhs: { $type: 'literal', value: '3' },
    },
  ],
  [
    '$abc==123 && ((123 || 321) == $cba)',
    {
      $type: 'binary',
      operator: 'and',
      lhs: {
        $type: 'binary',
        operator: 'eq',
        lhs: {
          $type: 'var',
          name: 'abc',
        },
        rhs: {
          $type: 'literal',
          value: '123',
        },
      },
      rhs: {
        $type: 'binary',
        operator: 'eq',
        lhs: {
          $type: 'binary',
          operator: 'or',
          lhs: {
            $type: 'literal',
            value: '123',
          },
          rhs: {
            $type: 'literal',
            value: '321',
          },
        },
        rhs: {
          $type: 'var',
          name: 'cba',
        },
      },
    },
  ],
])('parseConditionalNotation/success', (input, expected) => {
  const actual = parseConditionalNotation(input);

  expect(actual).toEqual(expected);
});

test.each<[string]>([
  ['$'],
  ['&&'],
  ['$a=='],
  ['($a==1'],
  ['()'],
  ['$$'],
  ['$a=1'],
  ['$$a==1'],
])('parseConditionalNotation/error', (input) => {
  expect(() => {
    const value = parseConditionalNotation(input);

    console.log(value);
  }).toThrow();
});
