import { describe, expect, test } from 'vitest';

import { StringTokenType, Token, TokenType } from './token.js';
import { tokenizeText } from './tokenizer.js';

describe('tokenizeText', () => {
  test.each<[string, Token[]]>([
    // Single tokens - every distinct token the tokenizer can emit.
    ['(', [TokenType.OPEN_BRACKET]],
    [')', [TokenType.CLOSE_BRACKET]],
    ['$', [TokenType.VAR_START]],
    ['!', [TokenType.NOT]],
    ['&&', [TokenType.AND]],
    ['||', [TokenType.OR]],
    ['==', [TokenType.EQ]],
    ['!=', [TokenType.NEQ]],
    ['<', [TokenType.LT]],
    ['<=', [TokenType.LTE]],
    ['>', [TokenType.GT]],
    ['>=', [TokenType.GTE]],
    ['123', [{ type: StringTokenType.LITERAL, value: '123' }]],
    ["'hello'", [{ type: StringTokenType.STRING, value: 'hello' }]],

    // String literals - single-quoted strings may contain whitespace and operator chars.
    ["'hello world'", [{ type: StringTokenType.STRING, value: 'hello world' }]],
    ["'a && b'", [{ type: StringTokenType.STRING, value: 'a && b' }]],
    ["'a || b == c'", [{ type: StringTokenType.STRING, value: 'a || b == c' }]],

    // Whitespace is ignored between tokens.
    [
      ' $abc ',
      [TokenType.VAR_START, { type: StringTokenType.LITERAL, value: 'abc' }],
    ],
    [
      '$a == 123',
      [
        TokenType.VAR_START,
        { type: StringTokenType.LITERAL, value: 'a' },
        TokenType.EQ,
        { type: StringTokenType.LITERAL, value: '123' },
      ],
    ],
    [
      '$a && $b',
      [
        TokenType.VAR_START,
        { type: StringTokenType.LITERAL, value: 'a' },
        TokenType.AND,
        TokenType.VAR_START,
        { type: StringTokenType.LITERAL, value: 'b' },
      ],
    ],

    // Variable references.
    [
      '$abc',
      [TokenType.VAR_START, { type: StringTokenType.LITERAL, value: 'abc' }],
    ],
    [
      '$a123',
      [TokenType.VAR_START, { type: StringTokenType.LITERAL, value: 'a123' }],
    ],

    // Comparison operators.
    [
      '$a<123',
      [
        TokenType.VAR_START,
        { type: StringTokenType.LITERAL, value: 'a' },
        TokenType.LT,
        { type: StringTokenType.LITERAL, value: '123' },
      ],
    ],
    [
      '$a<=123',
      [
        TokenType.VAR_START,
        { type: StringTokenType.LITERAL, value: 'a' },
        TokenType.LTE,
        { type: StringTokenType.LITERAL, value: '123' },
      ],
    ],
    [
      '$a>123',
      [
        TokenType.VAR_START,
        { type: StringTokenType.LITERAL, value: 'a' },
        TokenType.GT,
        { type: StringTokenType.LITERAL, value: '123' },
      ],
    ],
    [
      '$a>=123',
      [
        TokenType.VAR_START,
        { type: StringTokenType.LITERAL, value: 'a' },
        TokenType.GTE,
        { type: StringTokenType.LITERAL, value: '123' },
      ],
    ],
    [
      '$a!=123',
      [
        TokenType.VAR_START,
        { type: StringTokenType.LITERAL, value: 'a' },
        TokenType.NEQ,
        { type: StringTokenType.LITERAL, value: '123' },
      ],
    ],

    // Logical operators connecting two sub-expressions.
    [
      '$a&&$b',
      [
        TokenType.VAR_START,
        { type: StringTokenType.LITERAL, value: 'a' },
        TokenType.AND,
        TokenType.VAR_START,
        { type: StringTokenType.LITERAL, value: 'b' },
      ],
    ],
    [
      '$a||$b',
      [
        TokenType.VAR_START,
        { type: StringTokenType.LITERAL, value: 'a' },
        TokenType.OR,
        TokenType.VAR_START,
        { type: StringTokenType.LITERAL, value: 'b' },
      ],
    ],

    // Parentheses and nesting.
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
      '(($abc))',
      [
        TokenType.OPEN_BRACKET,
        TokenType.OPEN_BRACKET,
        TokenType.VAR_START,
        { type: StringTokenType.LITERAL, value: 'abc' },
        TokenType.CLOSE_BRACKET,
        TokenType.CLOSE_BRACKET,
      ],
    ],

    // Quoted string operands.
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
      "$abc=='some && text'",
      [
        TokenType.VAR_START,
        { type: StringTokenType.LITERAL, value: 'abc' },
        TokenType.EQ,
        { type: StringTokenType.STRING, value: 'some && text' },
      ],
    ],

    // Unary not.
    [
      '!$abc',
      [
        TokenType.NOT,
        TokenType.VAR_START,
        { type: StringTokenType.LITERAL, value: 'abc' },
      ],
    ],
  ])('%s', (input, expected) => {
    expect(tokenizeText(input)).toEqual(expected);
  });
});
