/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { type StringReader, stringReader } from './reader.js';
import { type Token, TokenType } from './token.js';

type TokenMap = Record<string, Token | undefined>;

const singleCharacterTokens: TokenMap = {
  '(': TokenType.OPEN_BRACKET,
  ')': TokenType.CLOSE_BRACKET,
  $: TokenType.VAR_START,
};

const eqTokens: Record<string, TokenType> = {
  '<': TokenType.LT,
  '>': TokenType.GT,
  '!': TokenType.NOT,
};

const repeatingTokens: TokenMap = {
  '&': TokenType.AND,
  '|': TokenType.OR,
  '=': TokenType.EQ,
};

const borrowedTokens = ['&', '|', '<', '>', '=', '!'] as const;
const borrowedTokenSet = new Set<string>(borrowedTokens);

type BorrowedToken = (typeof borrowedTokens)[number];

function parseTwoCharacterToken(
  reader: StringReader,
  borrowed: BorrowedToken
): Token {
  const repeatingToken = repeatingTokens[borrowed];
  if (repeatingToken !== undefined) {
    const next = reader.consume();
    if (next === borrowed) {
      return repeatingToken;
    }

    throw new Error(`Unknown token: ${borrowed}${next}`);
  }

  const next = reader.peek();
  const baseToken = eqTokens[borrowed];
  if (next === '=') {
    reader.consume();

    return (baseToken + 1) as Token;
  }

  return baseToken as Token;
}

export function findClosingQuoteIndex(text: string, startIndex: number = 0) {
  for (let i = startIndex; i < text.length; i++) {
    const c = text[i];

    if (c === "'" && text[i - 1] !== '\\') {
      return i + 1;
    }
  }

  throw new Error('Expected quote');
}

export function tokenizeText(text: string): Token[] {
  const reader = stringReader(text);
  const tokens: Token[] = [];
  let borrowedToken: BorrowedToken | undefined;
  let literalToken: string = '';

  function emitLiteralToken() {
    if (literalToken.length > 0) {
      tokens.push(literalToken);
      literalToken = '';
    }
  }

  while (true) {
    if (borrowedToken !== undefined) {
      const result = parseTwoCharacterToken(reader, borrowedToken);

      tokens.push(result);
      borrowedToken = undefined;
    }

    const c = reader.consume();
    if (c === undefined) {
      break;
    }

    if (c === ' ') {
      continue;
    }

    const singleCharToken = singleCharacterTokens[c];
    if (singleCharToken !== undefined) {
      emitLiteralToken();

      tokens.push(singleCharToken);
    } else if (borrowedTokenSet.has(c)) {
      emitLiteralToken();

      borrowedToken = c as BorrowedToken;
    } else if (c === "'") {
      emitLiteralToken();

      const position = reader.position();
      const nextPosition = findClosingQuoteIndex(text, position);

      tokens.push(text.slice(position, nextPosition - 1));

      reader.move(nextPosition);
    } else {
      literalToken += c;
    }
  }

  if (borrowedToken !== undefined) {
    throw new Error('Borrowed token is not undefined');
  }

  emitLiteralToken();

  return tokens;
}
