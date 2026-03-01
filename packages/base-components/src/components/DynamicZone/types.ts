import {
  ComponentEntry,
  ComponentId,
  ComponentNestedPathShape,
  ComponentOptions,
  ComponentOptionsById,
  ComponentSchema,
  ComponentSchemaNestedPathDetails,
  GetComponentSchemaTypes,
} from '@game-cms/core';
import { Key } from 'react';

import { NestedPathDot } from '../../internal/nestedPath.js';
import { TitleSpec, TitleSpecById } from '../../internal/title.js';
import { DataEntry, GetDataFromEntryArray } from './internal/types.js';

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
  outData: DataEntry<Types['outData'], K>;
  inData: DataEntry<Types['inData'], K>;
  resolvedData: DataEntry<Types['resolvedData'], K>;
  clientData: ClientDataEntry<Types['clientData'], K>;
  storageData: DataEntry<Types['storageData'], K>;
  searchIndexData: Types['searchIndexData'];
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
  outData: DynamicZoneArray<Input, 'outData'>;
  inData: DynamicZoneArray<Input, 'inData'>;
  options: Options<Input>;
  error: Error<Input>;
  resolvedData: DynamicZoneArray<Input, 'resolvedData'>;
  clientData: DynamicZoneArray<Input, 'clientData'>;
  storageData: DynamicZoneArray<Input, 'storageData'>;
  searchIndexData: DynamicZoneArray<Input, 'searchIndexData'>;
};

type NestedPathZone<T, Name extends string, Schema extends ComponentSchema> =
  | {
      path: `[${Name}]`;
      value: GetDataFromEntryArray<T, Name>;
    }
  | NestedPathDot<
      ComponentSchemaNestedPathDetails<GetDataFromEntryArray<T, Name>, Schema>,
      `[${Name}]`
    >;

type NestedPath<T, Input extends DynamicZoneInputComponents> = {
  [K in keyof Input & string]: NestedPathZone<T, K, Input[K]>;
}[keyof Input & string];

type NestedPathShape<Input extends DynamicZoneInputComponents> = {
  [K in keyof Input & string]: Input[K] extends ComponentSchema<
    infer Id,
    infer Args
  >
    ? DataEntry<ComponentNestedPathShape<Id, Args>, K>
    : DataEntry<unknown, K>;
}[keyof Input & string][];

declare module '@game-cms/core' {
  interface ComponentTypeMap<_Args> {
    'base::dynamic-zone': ComponentEntry<
      DynamicZoneEntry<ResolveInputComponents<_Args>>
    >;
  }

  interface ComponentNestedPathMap<T, Args> {
    'base::dynamic-zone': NestedPath<T, ResolveInputComponents<Args>>;
  }

  interface ComponentNestedPathShapeMap<Args> {
    'base::dynamic-zone': NestedPathShape<ResolveInputComponents<Args>>;
  }
}
