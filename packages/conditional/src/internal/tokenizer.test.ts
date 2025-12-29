import { expect, test } from 'vitest';

import { StringTokenType, Token, TokenType } from './token.js';
import { tokenizeText } from './tokenizer.js';

test.each<[string, Token[]]>([
  ['$', [TokenType.VAR_START]],
  ['<', [TokenType.LT]],
  ['<=', [TokenType.LTE]],
  ['&&', [TokenType.AND]],
  [
    '$abc',
    [TokenType.VAR_START, { type: StringTokenType.LITERAL, value: 'abc' }],
  ],
  [
    '$abc==true',
    [
      TokenType.VAR_START,
      { type: StringTokenType.LITERAL, value: 'abc' },
      TokenType.EQ,
      TokenType.TRUE,
    ],
  ],
  [
    '($abc)',
    [
      TokenType.OPEN_BRACKET,
      TokenType.VAR_START,
      { type: StringTokenType.LITERAL, value: 'abc' },
      TokenType.CLOSE_BRACKET,
    ],
  ],
  [
    "$abc=='123'",
    [
      TokenType.VAR_START,
      { type: StringTokenType.LITERAL, value: 'abc' },
      TokenType.EQ,
      { type: StringTokenType.STRING, value: '123' },
    ],
  ],
  [
    '!$abc',
    [
      TokenType.NOT,
      TokenType.VAR_START,
      { type: StringTokenType.LITERAL, value: 'abc' },
    ],
  ],
])('tokenizeText', (input, expected) => {
  const actual = tokenizeText(input);

  expect(actual).toEqual(expected);
});
