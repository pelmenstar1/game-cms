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

export type RawConditionalAlternativeChoice<T> = {
  condition: string;
  value: T;
};

export type ConditionalAlternativeChoice<T> = {
  condition: ConditionalAstExpression;
  value: T;
};

type BaseConditionalChoices<T, Choice> = {
  default: T;
  alternative?: Choice[];
};

export type ConditionalChoices<T> = BaseConditionalChoices<
  T,
  ConditionalAlternativeChoice<T>
>;

export type RawConditionalChoices<T> = BaseConditionalChoices<
  T,
  RawConditionalAlternativeChoice<T>
>;

export type EntityConditionalData<T extends EntityData = EntityData> = {
  [K in keyof T]: ConditionalChoices<T[K]>;
};

export type RawEntityConditionalData<T extends EntityData = EntityData> = {
  [K in keyof T]: RawConditionalChoices<T[K]>;
};

export type RawConditionalChoicesById<T extends ComponentId> =
  RawConditionalChoices<ComponentDataById<T>>;

export type ConditionalChoicesById<T extends ComponentId> = ConditionalChoices<
  ComponentDataById<T>
>;

export type EntityConditionalDataById<T extends EntityId> =
  EntityConditionalData<GetEntityById<T>>;

export type RawEntityConditionalDataById<T extends EntityId> =
  RawEntityConditionalData<GetEntityById<T>>;
