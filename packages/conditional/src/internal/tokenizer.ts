/* eslint-disable @typescript-eslint/no-unnecessary-condition */

import { findClosingQuoteIndex } from '@game-cms/shared/parser';

import { stringReader } from './reader.js';
import { StringTokenType, type Token, TokenType } from './token.js';

const tokenInfoMap: Record<string, Token> = {
  '(': TokenType.OPEN_BRACKET,
  ')': TokenType.CLOSE_BRACKET,
  $: TokenType.VAR_START,
  '<': TokenType.LT,
  '>': TokenType.GT,
  '!': TokenType.NOT,
  '<=': TokenType.LTE,
  '>=': TokenType.GTE,
  '&&': TokenType.AND,
  '||': TokenType.OR,
  '==': TokenType.EQ,
  '!=': TokenType.NEQ,
  true: TokenType.TRUE,
  false: TokenType.FALSE,
};

const tokenMapKeys = Object.keys(tokenInfoMap);

function canBeLiteral(char: string) {
  const code = char.toLowerCase().codePointAt(0) as number;

  return (code >= 0x61 && code <= 0x7a) || (code >= 0x30 && code <= 0x39);
}

export function tokenizeText(text: string): Token[] {
  const reader = stringReader(text);
  const tokens: Token[] = [];
  let borrowedToken: string = '';

  let literalToken: string = '';

  function emitLiteralToken() {
    if (literalToken.length > 0) {
      tokens.push({ type: StringTokenType.LITERAL, value: literalToken });
      literalToken = '';
    }
  }

  function emitToken(value: Token) {
    emitLiteralToken();

    tokens.push(value);
  }

  while (true) {
    const c = reader.consume();
    if (c === undefined) {
      break;
    }

    if (c === ' ') {
      continue;
    }

    borrowedToken += c;

    const bToken = borrowedToken;
    const hasNextTokens = tokenMapKeys.some((text) => text.startsWith(bToken));

    if (!hasNextTokens) {
      const prevToken = bToken.slice(0, -1);
      const tokenToEmit = tokenInfoMap[prevToken];

      borrowedToken = '';

      if (tokenToEmit !== undefined) {
        emitToken(tokenToEmit);

        reader.move(reader.position() - 1);

        continue;
      } else {
        literalToken += prevToken;
      }
    }

    if (borrowedToken.length === 0) {
      if (c === "'") {
        const position = reader.position();
        const nextPosition = findClosingQuoteIndex(text, position);

        emitToken({
          type: StringTokenType.STRING,
          value: text.slice(position, nextPosition - 1),
        });

        reader.move(nextPosition);
      } else {
        if (canBeLiteral(c)) {
          literalToken += c;
        } else {
          emitLiteralToken();
        }
      }
    }
  }

  const tokenToEmit = tokenInfoMap[borrowedToken];
  if (tokenToEmit !== undefined) {
    emitToken(tokenToEmit);

    borrowedToken = '';
  }

  literalToken += borrowedToken;

  emitLiteralToken();

  return tokens;
}
