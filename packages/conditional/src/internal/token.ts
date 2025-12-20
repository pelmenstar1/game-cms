export const enum TokenType {
  OPEN_BRACKET = 0,
  CLOSE_BRACKET = 1,
  AND = 10,
  OR = 11,
  LT = 12,
  LTE = 13,
  GT = 14,
  GTE = 15,
  EQ = 16,
  NOT = 17,
  NEQ = 18,
  VAR_START = 20,
}

export type Token = TokenType | string;
