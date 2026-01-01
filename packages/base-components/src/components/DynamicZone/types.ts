import {
  ComponentClientDataById,
  ComponentData,
  ComponentEntry,
  ComponentErrorById,
  ComponentId,
  ComponentOptions,
  ComponentOptionsById,
  ComponentRawDataById,
  ComponentResolvedDataById,
  ComponentSchema,
  ComponentStorageDataById,
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
        id: Id;
        options: ComponentOptionsById<Id, Args>;
        error: ComponentErrorById<Id, Args> | undefined;
        rawData: DataEntry<ComponentRawDataById<Id, Args>, K>;
        resolvedData: DataEntry<ComponentResolvedDataById<Id, Args>, K>;
        clientData: ClientDataEntry<ComponentClientDataById<Id, Args>, K>;
        storageData: DataEntry<ComponentStorageDataById<Id, Args>, K>;
      }
    : {
        id: ComponentId;
        options: ComponentOptions;
        error: unknown;
        rawData: DataEntry<ComponentData, K>;
        resolvedData: DataEntry<ComponentData, K>;
        clientData: ClientDataEntry<ComponentData, K>;
        storageData: DataEntry<ComponentData, K>;
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
  rawData: DynamicZoneArray<Input, 'rawData'>;
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
