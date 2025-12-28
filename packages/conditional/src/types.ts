import type { ConditionalAstExpression } from './ast.js';

export type ConditionalValueInputAtom = string | number | boolean;

export type ConditionalValueInput = Record<
  string,
  ConditionalValueInputAtom | undefined
>;

export type RawConditionalNotation = string;

export type ConditionalAlternativeChoice<
  T,
  Condition = ConditionalAstExpression,
> = {
  condition: Condition;
  value: T;
};

export type ConditionalData<T, Condition = ConditionalAstExpression> = {
  default: T;
  alternative: ConditionalAlternativeChoice<T, Condition>[];
};
