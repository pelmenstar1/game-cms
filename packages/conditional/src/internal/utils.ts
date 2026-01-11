import type {
  ConditionalBinaryOperator,
  ConditionalUnaryOperator,
} from '../ast.js';
import { type Token, TokenType } from './token.js';

const binaryOperatorTokenToText: Partial<
  Record<TokenType, ConditionalBinaryOperator>
> = {
  [TokenType.AND]: 'and',
  [TokenType.OR]: 'or',
  [TokenType.LT]: 'lt',
  [TokenType.LTE]: 'lte',
  [TokenType.GT]: 'gt',
  [TokenType.GTE]: 'gte',
  [TokenType.EQ]: 'eq',
  [TokenType.NEQ]: 'neq',
};

const unaryOperatorTokenToText: Partial<
  Record<TokenType, ConditionalUnaryOperator>
> = {
  [TokenType.NOT]: 'not',
};

export function getBinaryOperatorFromToken(token: Token) {
  if (typeof token === 'number') {
    return binaryOperatorTokenToText[token];
  }
}

export function getUnaryOperatorFromToken(token: Token) {
  if (typeof token === 'number') {
    return unaryOperatorTokenToText[token];
  }
}

export function findClosingBracketIndex(
  tokens: Token[],
  startIndex: number = 0
): number {
  let level = 0;

  for (let i = startIndex; i < tokens.length; i++) {
    const token = tokens[i];

    if (token === TokenType.OPEN_BRACKET) {
      level++;
    } else if (token === TokenType.CLOSE_BRACKET) {
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
