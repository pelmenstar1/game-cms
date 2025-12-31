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

type Error<Input extends DynamicZoneInput> = {
  [K in keyof Input]: Input[K] extends ComponentSchema<infer Id, infer Args>
    ? ComponentErrorById<Id, Args>
    : unknown;
}[keyof Input][];

type DataEntry<Data, K> = {
  key: K;
  data: Data;
};

type Data<Input extends DynamicZoneInput> = {
  [K in keyof Input]: Input[K] extends ComponentSchema<infer Id, infer Args>
    ? DataEntry<ComponentDataById<Id, Args>, keyof Input>
    : DataEntry<ComponentData, keyof Input>;
}[keyof Input][];

type ResolvedData<Input extends DynamicZoneInput> = {
  [K in keyof Input]: Input[K] extends ComponentSchema<infer Id, infer Args>
    ? DataEntry<ComponentResolvedDataById<Id, Args>, keyof Input>
    : DataEntry<ComponentData, keyof Input>;
}[keyof Input][];

type OptionsEntry<Options> = {
  componentId: ComponentId;
  title: string;
  options: Options;
};

type Options<Input extends DynamicZoneInput> = {
  [K in keyof Input]: Input[K] extends ComponentSchema<infer Id, infer Args>
    ? OptionsEntry<ComponentOptionsById<Id, Args>>
    : OptionsEntry<ComponentOptions>;
};

interface ClientDataEntry<Data, K> extends DataEntry<Data, K> {
  clientKey: Key;
}

type ClientData<Input extends DynamicZoneInput> = {
  [K in keyof Input]: Input[K] extends ComponentSchema<infer Id, infer Args>
    ? ClientDataEntry<ComponentClientDataById<Id, Args>, keyof Input>
    : ClientDataEntry<ComponentData, keyof Input>;
}[keyof Input][];

declare module '@game-cms/types' {
  interface ComponentTypeMap<_Args> {
    'base::dynamic-zone': ComponentEntry<{
      data: Data<ResolveInput<_Args>>;
      options: Options<ResolveInput<_Args>>;
      error: Error<ResolveInput<_Args>>;
      resolvedData: ResolvedData<ResolveInput<_Args>>;
      clientData: ClientData<ResolveInput<_Args>>;
    }>;
  }
}
