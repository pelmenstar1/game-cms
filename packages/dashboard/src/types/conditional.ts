import type { EntityData, EntityId, GetEntityById } from '@game-cms/base-types';
import type {
  ComponentData,
  ComponentDataById,
  ComponentErrorById,
  ComponentId,
} from '@game-cms/types';

export type RawConditionalAlternativeChoice<
  Data extends ComponentData,
  Error,
> = {
  condition: string;
  error?: Error;
  value: Data;
};

export type RawConditionalChoices<
  Data extends ComponentData = ComponentData,
  Error = unknown,
> = {
  default: {
    value: Data;
    error?: Error;
  };
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
