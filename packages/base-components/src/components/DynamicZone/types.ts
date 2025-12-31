import {
  ComponentClientDataById,
  ComponentData,
  ComponentDataById,
  ComponentEntry,
  ComponentErrorById,
  ComponentId,
  ComponentOptions,
  ComponentOptionsById,
  ComponentResolvedDataById,
  ComponentSchema,
} from '@game-cms/types';
import { Key } from 'react';

export type DynamicZoneInput = Record<
  string,
  { title: string; component: ComponentSchema }
>;

type ResolveInput<T> = T extends DynamicZoneInput ? T : DynamicZoneInput;

type DataEntry<Data, K> = {
  key: K;
  data: Data;
};

interface ClientDataEntry<Data, K> extends DataEntry<Data, K> {
  clientKey: Key;
}

type GetSchemaParams<T = unknown, K = string> =
  T extends ComponentSchema<infer Id, infer Args>
    ? {
        options: ComponentOptionsById<Id, Args>;
        data: DataEntry<ComponentDataById<Id, Args>, K>;
        error: ComponentErrorById<Id, Args> | undefined;
        id: Id;
        resolvedData: DataEntry<ComponentResolvedDataById<Id, Args>, K>;
        clientData: ClientDataEntry<ComponentClientDataById<Id, Args>, K>;
      }
    : {
        options: ComponentOptions;
        data: DataEntry<ComponentData, K>;
        error: unknown;
        id: ComponentId;
        resolvedData: DataEntry<ComponentData, K>;
        clientData: ClientDataEntry<ComponentData, K>;
      };

type DynamicZoneArray<
  Input extends DynamicZoneInput,
  TK extends keyof GetSchemaParams,
> = {
  [K in keyof Input]: GetSchemaParams<Input[K]['component'], K>[TK];
}[keyof Input][];

type OptionsEntry<Options, Id> = {
  componentId: Id;
  title: string;
  options: Options;
};

type Options<Input extends DynamicZoneInput> = {
  [K in keyof Input]: Input[K]['component'] extends ComponentSchema<
    infer Id,
    infer Args
  >
    ? OptionsEntry<ComponentOptionsById<Id, Args>, Id>
    : OptionsEntry<ComponentOptions, ComponentId>;
};

type DynamicZoneEntry<Input extends DynamicZoneInput> = {
  data: DynamicZoneArray<Input, 'data'>;
  options: Options<Input>;
  error: DynamicZoneArray<Input, 'error'>;
  resolvedData: DynamicZoneArray<Input, 'resolvedData'>;
  clientData: DynamicZoneArray<Input, 'clientData'>;
};

declare module '@game-cms/types' {
  interface ComponentTypeMap<_Args> {
    'base::dynamic-zone': ComponentEntry<DynamicZoneEntry<ResolveInput<_Args>>>;
  }
}
