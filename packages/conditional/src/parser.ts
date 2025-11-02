import type { ConditionalAstExpression } from './ast.js';
import {
  findClosingBracketIndex,
  parseRhsAsBinaryExpression,
} from './utils.js';

export function parseConditionalToAst(input: string): ConditionalAstExpression {
  input = input.trim();

  if (input.length === 0) {
    throw new Error('Invalid input');
  }

  const firstChar = input[0];
  if (firstChar === '(') {
    const lhsEnd = findClosingBracketIndex(input);
    const operatorResult = parseRhsAsBinaryExpression(input.slice(lhsEnd));

    if (operatorResult === null) {
      throw new Error('Expected operator');
    }

    const { operator, rhs } = operatorResult;

    const lhs = input.slice(0, lhsEnd + 1);

    return {
      $type: 'binary',
      lhs: parseConditionalToAst(lhs),
      rhs: parseConditionalToAst(rhs),
      operator,
    };
  }

  return { $type: 'literal', value: '' };
}
