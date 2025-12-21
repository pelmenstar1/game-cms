import type {
  ConditionalAstExpression,
  ConditionalBinaryOperator,
  ConditionalUnaryOperator,
} from './ast.js';
import { type Token, TokenType } from './internal/token.js';
import { tokenizeText } from './internal/tokenizer.js';
import {
  findClosingBracketIndex,
  getBinaryOperatorFromToken,
  getUnaryOperatorFromToken,
} from './internal/utils.js';

function invalidExpression(message: string): never {
  throw new Error(`Invalid expression: ${message}`);
}

function parseTokens(tokens: Token[]): ConditionalAstExpression {
  let lastExpression: ConditionalAstExpression | undefined;
  let lastBinaryOperator: ConditionalBinaryOperator | undefined;
  let lastUnaryOperator: ConditionalUnaryOperator | undefined;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const prevToken = tokens[i - 1] as Token | undefined;

    let currentExpression: ConditionalAstExpression | undefined;

    // Skip VAR_START and check literal of the next token.
    if (token === TokenType.VAR_START) {
      continue;
    }

    const isPrevVarStart = prevToken === TokenType.VAR_START;
    const isLiteral = typeof token === 'string';

    if (isPrevVarStart && !isLiteral) {
      invalidExpression('expected literal after $');
    }

    if (isLiteral) {
      currentExpression = isPrevVarStart
        ? { $type: 'var', name: token }
        : { $type: 'literal', value: token };
    }

    if (token === TokenType.OPEN_BRACKET) {
      const lastIndex = findClosingBracketIndex(tokens, i);

      currentExpression = parseTokens(tokens.slice(i + 1, lastIndex));

      i = lastIndex - 1;
    }

    if (lastBinaryOperator !== undefined) {
      if (lastExpression === undefined || currentExpression === undefined) {
        invalidExpression('invalid sequence of tokens');
      }

      lastExpression = {
        $type: 'binary',
        operator: lastBinaryOperator,
        lhs: lastExpression,
        rhs: currentExpression,
      };

      lastBinaryOperator = undefined;

      continue;
    }

    if (lastUnaryOperator !== undefined) {
      if (currentExpression === undefined) {
        invalidExpression('invalid sequence of tokens');
      }

      lastExpression = {
        $type: 'unary',
        operator: lastUnaryOperator,
        expr: currentExpression,
      };

      lastUnaryOperator = undefined;

      continue;
    }

    if (currentExpression !== undefined) {
      lastExpression = currentExpression;
    }

    const binaryOperator = getBinaryOperatorFromToken(token);
    if (binaryOperator !== undefined) {
      lastBinaryOperator = binaryOperator;

      continue;
    }

    const unaryOperator = getUnaryOperatorFromToken(token);
    if (unaryOperator !== undefined) {
      lastUnaryOperator = unaryOperator;

      continue;
    }
  }

  if (lastBinaryOperator !== undefined) {
    invalidExpression('expected expression after binary operator');
  }

  if (lastUnaryOperator !== undefined) {
    invalidExpression('expected expression after unary operator');
  }

  if (lastExpression === undefined) {
    invalidExpression('empty text');
  }

  return lastExpression;
}

export function parseConditionalNotation(
  input: string
): ConditionalAstExpression {
  const tokens = tokenizeText(input);

  return parseTokens(tokens);
}
