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

function invalidSequenceOfTokens(): never {
  invalidExpression('invalid sequence of tokens');
}

function expectedExpressionAfter(type: string): never {
  invalidExpression(`expected expression after ${type} operator`);
}

function parseTokens(tokens: Token[]): ConditionalAstExpression {
  let lastExpression: ConditionalAstExpression | undefined;
  let lastBinaryOperator: ConditionalBinaryOperator | undefined;
  const pendingUnaryOperators: ConditionalUnaryOperator[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const prevToken = tokens[i - 1] as Token | undefined;

    const isPrevVarStart = prevToken === TokenType.VAR_START;
    const isStringToken = typeof token === 'object';

    if (isPrevVarStart && !isStringToken) {
      invalidExpression('expected literal after $');
    }

    // Skip VAR_START and check literal of the next token.
    if (token === TokenType.VAR_START) {
      continue;
    }

    let currentExpression: ConditionalAstExpression | undefined;

    if (isStringToken) {
      currentExpression = isPrevVarStart
        ? { $type: 'var', name: token.value }
        : { $type: 'literal', value: token.value };
    }

    if (token === TokenType.OPEN_BRACKET) {
      const lastIndex = findClosingBracketIndex(tokens, i);

      currentExpression = parseTokens(tokens.slice(i + 1, lastIndex));

      i = lastIndex - 1;
    }

    const unaryOperator = getUnaryOperatorFromToken(token);
    if (unaryOperator !== undefined) {
      pendingUnaryOperators.push(unaryOperator);

      continue;
    }

    if (pendingUnaryOperators.length > 0) {
      if (currentExpression === undefined) {
        invalidSequenceOfTokens();
      }

      for (let i = pendingUnaryOperators.length - 1; i >= 0; i--) {
        const op = pendingUnaryOperators[i];

        currentExpression = {
          $type: 'unary',
          operator: op,
          expr: currentExpression,
        };
      }

      pendingUnaryOperators.length = 0;
    }

    if (lastBinaryOperator !== undefined) {
      if (lastExpression === undefined || currentExpression === undefined) {
        invalidSequenceOfTokens();
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

    if (currentExpression !== undefined) {
      lastExpression = currentExpression;
    }

    const binaryOperator = getBinaryOperatorFromToken(token);
    if (binaryOperator !== undefined) {
      lastBinaryOperator = binaryOperator;
    }
  }

  if (lastBinaryOperator !== undefined) {
    expectedExpressionAfter('binary');
  }

  if (pendingUnaryOperators.length > 0) {
    expectedExpressionAfter('unary');
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
