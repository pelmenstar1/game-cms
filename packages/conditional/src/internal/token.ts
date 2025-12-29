export const enum TokenType {
  OPEN_BRACKET = 0,
  CLOSE_BRACKET = 1,
  AND = 2,
  OR = 3,
  LT = 4,
  LTE = 5,
  GT = 6,
  GTE = 7,
  EQ = 8,
  NOT = 9,
  NEQ = 10,
  VAR_START = 11,
  TRUE = 12,
  FALSE = 13,
}

export const enum StringTokenType {
  STRING = 20,
  LITERAL = 21,
}

export type Token = TokenType | { type: StringTokenType; value: string };
