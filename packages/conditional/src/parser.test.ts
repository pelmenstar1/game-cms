import { describe, expect, test } from 'vitest';

import type { ConditionalAstExpression } from './ast.js';
import { parseConditionalNotation } from './parser.js';

describe('parseConditionalNotation', () => {
  describe('success', () => {
    test.each<[string, ConditionalAstExpression]>([
      // Atoms.
      ['$name', { $type: 'var', name: 'name' }],
      ['123', { $type: 'literal', value: '123' }],
      ["'hello'", { $type: 'literal', value: 'hello' }],

      // Unary not.
      [
        '!$name',
        {
          $type: 'unary',
          operator: 'not',
          expr: { $type: 'var', name: 'name' },
        },
      ],
      [
        '!123',
        {
          $type: 'unary',
          operator: 'not',
          expr: { $type: 'literal', value: '123' },
        },
      ],

      // Comparison operators.
      [
        '$name==123',
        {
          $type: 'binary',
          operator: 'eq',
          lhs: { $type: 'var', name: 'name' },
          rhs: { $type: 'literal', value: '123' },
        },
      ],
      [
        '$name!=123',
        {
          $type: 'binary',
          operator: 'neq',
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
        '$name<=123',
        {
          $type: 'binary',
          operator: 'lte',
          lhs: { $type: 'var', name: 'name' },
          rhs: { $type: 'literal', value: '123' },
        },
      ],
      [
        '$name>123',
        {
          $type: 'binary',
          operator: 'gt',
          lhs: { $type: 'var', name: 'name' },
          rhs: { $type: 'literal', value: '123' },
        },
      ],
      [
        '$name>=123',
        {
          $type: 'binary',
          operator: 'gte',
          lhs: { $type: 'var', name: 'name' },
          rhs: { $type: 'literal', value: '123' },
        },
      ],

      // Logical operators.
      [
        '$a&&$b',
        {
          $type: 'binary',
          operator: 'and',
          lhs: { $type: 'var', name: 'a' },
          rhs: { $type: 'var', name: 'b' },
        },
      ],
      [
        '$a||$b',
        {
          $type: 'binary',
          operator: 'or',
          lhs: { $type: 'var', name: 'a' },
          rhs: { $type: 'var', name: 'b' },
        },
      ],

      // Literal on both sides.
      [
        '123==321',
        {
          $type: 'binary',
          operator: 'eq',
          lhs: { $type: 'literal', value: '123' },
          rhs: { $type: 'literal', value: '321' },
        },
      ],

      // Quoted string operand containing operator characters.
      [
        "$abc=='some && text'",
        {
          $type: 'binary',
          operator: 'eq',
          lhs: { $type: 'var', name: 'abc' },
          rhs: { $type: 'literal', value: 'some && text' },
        },
      ],

      // Grouping.
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

      // Complex nested expression.
      [
        '$abc==123 && ((123 || 321) == $cba)',
        {
          $type: 'binary',
          operator: 'and',
          lhs: {
            $type: 'binary',
            operator: 'eq',
            lhs: { $type: 'var', name: 'abc' },
            rhs: { $type: 'literal', value: '123' },
          },
          rhs: {
            $type: 'binary',
            operator: 'eq',
            lhs: {
              $type: 'binary',
              operator: 'or',
              lhs: { $type: 'literal', value: '123' },
              rhs: { $type: 'literal', value: '321' },
            },
            rhs: { $type: 'var', name: 'cba' },
          },
        },
      ],
      [
        '$a && !$b',
        {
          $type: 'binary',
          operator: 'and',
          lhs: { $type: 'var', name: 'a' },
          rhs: {
            $type: 'unary',
            operator: 'not',
            expr: { $type: 'var', name: 'b' },
          },
        },
      ],
      [
        '!!$a',
        {
          $type: 'unary',
          operator: 'not',
          expr: {
            $type: 'unary',
            operator: 'not',
            expr: { $type: 'var', name: 'a' },
          },
        },
      ],
    ])('%s', (input, expected) => {
      expect(parseConditionalNotation(input)).toEqual(expected);
    });
  });

  describe('error', () => {
    test.each<[string]>([
      // Incomplete variable reference.
      ['$'],
      ['$$'],
      ['$$a==1'],

      // Binary operator without operands.
      ['&&'],
      ['||'],
      ['=='],

      // Binary operator missing right-hand side.
      ['$a=='],
      ['$a>'],

      // Unary operator without operand.
      ['!'],

      // Bracket errors.
      ['($a==1'],
      ['()'],
    ])('%s', (input) => {
      expect(() => parseConditionalNotation(input)).toThrow();
    });
  });
});
