import { expect, test } from 'vitest';

import { type Token, TokenType } from './token.js';
import { findClosingBracketIndex, findClosingQuoteIndex } from './utils.js';

const open: Token = TokenType.OPEN_BRACKET;
const content: Token = TokenType.AND;
const close: Token = TokenType.CLOSE_BRACKET;

test.each<[Token[], number]>([
  [[open, content, close], 3],
  [[open, open, content, content, close, close], 6],
  [[open, content, close, content, content, close, content, close], 3],
  [[open, content, open, close, content, close], 6],
])('findClosingBracketIndex/success', (input, expected) => {
  const actual = findClosingBracketIndex(input);

  expect(actual).toEqual(expected);
});

test.each<[string, number]>([
  [`123'`, 4],
  [String.raw`12\'12'`, 7],
])('findClosingQuoteIndex', (input, expected) => {
  const actual = findClosingQuoteIndex(input);

  expect(actual).toEqual(expected);
});
