import type { EntityData, EntityId, GetEntityById } from '@game-cms/types';

import type { ConditionalAstExpression } from './ast.js';

export type ConditionalValueInputAtom = string | number | boolean;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ConditionalValueInput
  extends Record<string, ConditionalValueInputAtom> {}

export type RawConditionalNotation = string;

export type ConditionalChoices<T> = {
  default: T;
  alternative?: [ConditionalAstExpression, T][];
};

export type EntityConditionalData<T extends EntityData = EntityData> = {
  [K in keyof T]: ConditionalChoices<T[K]>;
};

export type EntityConditionalDataById<T extends EntityId> =
  EntityConditionalData<GetEntityById<T>>;
