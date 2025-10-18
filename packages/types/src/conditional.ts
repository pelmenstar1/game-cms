export type ConditionalValueInputAtom = string | number | boolean;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CondationalValueInput
  extends Record<string, ConditionalValueInputAtom> {}

export type RawCondationalNotation = string;
