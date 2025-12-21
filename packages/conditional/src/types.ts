import type { EntityData, EntityId, GetEntityById } from '@game-cms/base-types';
import type { ComponentDataById, ComponentId } from '@game-cms/types';

import type { ConditionalAstExpression } from './ast.js';

export type ConditionalValueInputAtom = string | number | boolean;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ConditionalValueInput extends Record<
  string,
  ConditionalValueInputAtom | undefined
> {}

export type RawConditionalNotation = string;

export type ConditionalAlternativeChoice<T> = {
  condition: ConditionalAstExpression;
  value: T;
};

export type BaseConditionalChoices<T, Choice> = {
  default: T;
  alternative?: Choice[];
};

export type ConditionalChoices<T> = BaseConditionalChoices<
  T,
  ConditionalAlternativeChoice<T>
>;

export type EntityConditionalData<T extends EntityData = EntityData> = {
  [K in keyof T]: ConditionalChoices<T[K]>;
};

export type ConditionalChoicesById<T extends ComponentId> = ConditionalChoices<
  ComponentDataById<T>
>;

export type EntityConditionalDataById<T extends EntityId> =
  EntityConditionalData<GetEntityById<T>>;
