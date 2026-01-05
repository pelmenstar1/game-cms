import {
  ComponentEntry,
  ComponentId,
  ComponentOptions,
  ComponentOptionsById,
  ComponentSchema,
  GetComponentSchemaTypes,
} from '@game-cms/core';
import { Key } from 'react';

import { TitleSpec, TitleSpecById } from '../../internal/title.js';

type BaseDynamicZoneInputEntry<Id extends ComponentId, Args, Title> = {
  title?: Title;
  option: { title: string };
  component: ComponentSchema<Id, Args>;
};

export type DynamicZoneInputEntry<
  Id extends ComponentId,
  Args,
> = BaseDynamicZoneInputEntry<Id, Args, TitleSpecById<Id, Args>>;

interface SharedOptions {
  minItems?: number;
  maxItems?: number;
}

export interface DynamicZoneInput extends SharedOptions {
  options: Record<
    string,
    BaseDynamicZoneInputEntry<ComponentId, unknown, TitleSpec>
  >;
}

type DynamicZoneInputComponents = Record<string, ComponentSchema>;

type ResolveInputComponents<T> = T extends DynamicZoneInput
  ? {
      [K in keyof T['options']]: T['options'][K]['component'];
    }
  : DynamicZoneInputComponents;

type DataEntry<Data, K> = {
  key: K;
  data: Data;
};

interface ClientDataEntry<Data, K> extends DataEntry<Data, K> {
  clientKey: Key;
}

type GetDynamicZoneParams<
  T = unknown,
  K = string,
  Types extends GetComponentSchemaTypes = GetComponentSchemaTypes<T>,
> = {
  id: Types['componentId'];
  options: Types['options'];
  error: Types['error'] | undefined;
  rawData: DataEntry<Types['rawData'], K>;
  rawInData: DataEntry<Types['rawInData'], K>;
  resolvedData: DataEntry<Types['resolvedData'], K>;
  clientData: ClientDataEntry<Types['clientData'], K>;
  storageData: DataEntry<Types['storageData'], K>;
};

type DynamicZoneArray<
  Input extends DynamicZoneInputComponents,
  TK extends keyof GetDynamicZoneParams,
> = {
  [K in keyof Input]: GetDynamicZoneParams<Input[K], K>[TK];
}[keyof Input][];

type OptionsEntry<Options, Id extends ComponentId, Args> = {
  componentId: Id;
  title?: TitleSpecById<Id, Args>;
  option: { title: string };
  options: Options;
};

interface Options<
  Input extends DynamicZoneInputComponents,
> extends SharedOptions {
  minItems?: number;
  maxItems?: number;
  options: {
    [K in keyof Input]: Input[K] extends ComponentSchema<infer Id, infer Args>
      ? OptionsEntry<ComponentOptionsById<Id, Args>, Id, Args>
      : OptionsEntry<ComponentOptions, ComponentId, unknown>;
  };
}

export type OwnError = 'INVALID_TYPE' | 'TOO_FEW_ITEMS' | 'TOO_MANY_ITEMS';

type Error<Input extends DynamicZoneInputComponents> = {
  ownError?: OwnError;
  items?: DynamicZoneArray<Input, 'error'>;
};

type DynamicZoneEntry<Input extends DynamicZoneInputComponents> = {
  rawData: DynamicZoneArray<Input, 'rawData'>;
  rawInData: DynamicZoneArray<Input, 'rawInData'>;
  options: Options<Input>;
  error: Error<Input>;
  resolvedData: DynamicZoneArray<Input, 'resolvedData'>;
  clientData: DynamicZoneArray<Input, 'clientData'>;
  storageData: DynamicZoneArray<Input, 'storageData'>;
};

declare module '@game-cms/core' {
  interface ComponentTypeMap<_Args> {
    'base::dynamic-zone': ComponentEntry<
      DynamicZoneEntry<ResolveInputComponents<_Args>>
    >;
  }
}
