/* eslint-disable unicorn/no-for-loop */
import type { ConditionalBinaryOperator } from './ast.js';

const binaryOperatorToText: Record<string, ConditionalBinaryOperator> = {
  '&&': 'and',
  '||': 'or',
  '==': 'eq',
  '!=': 'neq',
  '<=': 'lte',
  '>=': 'gte',
  '<': 'lt',
  '>': 'gt',
};

export function findClosingBracketIndex(value: string): number {
  let level = 0;

  for (let i = 0; i < value.length; i++) {
    const c = value[i];

    if (c === '(') {
      level++;
    } else if (c === ')') {
      level--;

      if (level === 0) {
        return i + 1;
      } else if (level < 0) {
        break;
      }
    }
  }

  throw new Error('Invalid bracket sequence');
}

export function findNonWhitespaceCharacterIndex(value: string): number {
  for (let i = 0; i < value.length; i++) {
    const c = value[i];

    if (c !== ' ') {
      return i;
    }
  }

  throw new Error('String is empty');
}

export function parseRhsAsBinaryExpression(value: string) {
  value = value.trim();

  for (const [text, operator] of Object.entries(binaryOperatorToText)) {
    if (value.startsWith(text)) {
      return { operator, rhs: value.slice(text.length) };
    }
  }

  return null;
}
