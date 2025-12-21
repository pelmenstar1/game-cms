import type { EntityData, EntityId, GetEntityById } from '@game-cms/base-types';
import type { ConditionalAstExpression } from '@game-cms/conditional';
import type {
  ComponentData,
  ComponentDataById,
  ComponentErrorById,
  ComponentId,
} from '@game-cms/types';

export type RawConditionInfo = {
  raw: string;
  expression: ConditionalAstExpression | null;
  error?: string;
};

export type ValueWithError<T, Error = unknown> = {
  value: T;
  error?: Error;
};

export type RawConditionalAlternativeChoice<
  Data extends ComponentData,
  Error,
> = {
  condition: RawConditionInfo;
  data: ValueWithError<Data, Error>;
};

export type RawConditionalChoices<
  Data extends ComponentData = ComponentData,
  Error = unknown,
> = {
  default: ValueWithError<Data, Error>;
  alternative: RawConditionalAlternativeChoice<Data, Error>[];
};

export type RawEntityConditionalData<
  T extends EntityData = EntityData,
  Error = unknown,
> = {
  [K in keyof T]: RawConditionalChoices<T[K], Error>;
};

export type RawConditionalAlternativeChoiceById<Id extends ComponentId> =
  RawConditionalAlternativeChoice<
    ComponentDataById<Id>,
    ComponentErrorById<Id>
  >;

export type RawConditionalChoicesById<Id extends ComponentId> =
  RawConditionalChoices<ComponentDataById<Id>, ComponentErrorById<Id>>;

export type RawEntityConditionalDataById<Id extends EntityId> =
  RawEntityConditionalData<GetEntityById<Id>, ComponentErrorById<Id>>;
