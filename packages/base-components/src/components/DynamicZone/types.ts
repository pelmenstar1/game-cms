import {
  ComponentEntry,
  ComponentId,
  ComponentNestedPathDot,
  ComponentNestedPathShape,
  ComponentOptions,
  ComponentOptionsById,
  ComponentSchema,
  ComponentSchemaNestedPath,
  GetComponentSchemaTypes,
  ParseComponentNestedPath,
} from '@game-cms/core';
import { Key } from 'react';

import { TitleSpec, TitleSpecById } from '../../internal/title.js';
import { DataEntry } from './internal/types.js';

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
  rawData: DataEntry<Types['rawData'], K>;
  rawInData: DataEntry<Types['rawInData'], K>;
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
  rawData: DynamicZoneArray<Input, 'rawData'>;
  rawInData: DynamicZoneArray<Input, 'rawInData'>;
  options: Options<Input>;
  error: Error<Input>;
  resolvedData: DynamicZoneArray<Input, 'resolvedData'>;
  clientData: DynamicZoneArray<Input, 'clientData'>;
  storageData: DynamicZoneArray<Input, 'storageData'>;
  searchIndexData: DynamicZoneArray<Input, 'searchIndexData'>;
};

type NestedPath<T, Input extends DynamicZoneInputComponents> = {
  path: {
    [K in keyof Input & string]: ComponentNestedPathDot<
      `[${K}]`,
      ComponentSchemaNestedPath<T, Input[K]>
    >;
  }[keyof Input & string];
};

type NestedPathShape<Input extends DynamicZoneInputComponents> = {
  [K in keyof Input & string]: Input[K] extends ComponentSchema<
    infer Id,
    infer Args
  >
    ? DataEntry<ComponentNestedPathShape<Id, Args>, K>
    : DataEntry<unknown, K>;
}[keyof Input & string][];

type BaseParseNestedPathTransitionNext<
  T,
  Zone extends string,
  Suffix extends string,
  Input extends DynamicZoneInputComponents,
> =
  Input extends Record<Zone, ComponentSchema<infer Id, infer Args>>
    ? T extends DataEntry<infer Data, Zone>[]
      ? ParseComponentNestedPath<Data, Suffix, Id, Args>
      : unknown
    : unknown;

type BaseParseNestedPathTransitionCurrent<
  T,
  Zone extends string,
> = T extends DataEntry<infer Data, Zone>[] ? Data : unknown;

type BaseParseNestedPath<
  T,
  Path extends string,
  Input extends DynamicZoneInputComponents,
> = Path extends `[${infer Zone}].${infer Suffix}`
  ? BaseParseNestedPathTransitionNext<T, Zone, Suffix, Input>
  : Path extends `[${infer Zone}]`
    ? BaseParseNestedPathTransitionCurrent<T, Zone>
    : unknown;

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

  interface ComponentNestedPathParserMap<T, Path extends string, Args> {
    'base::dynamic-zone': BaseParseNestedPath<
      T,
      Path,
      ResolveInputComponents<Args>
    >;
  }
}
