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
  Input extends DynamicZoneInputComponents,
  TK extends keyof GetSchemaParams,
> = {
  [K in keyof Input]: GetSchemaParams<Input[K], K>[TK];
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

export type OwnError = 'TOO_FEW_ITEMS' | 'TOO_MANY_ITEMS';

type Error<Input extends DynamicZoneInputComponents> = {
  ownError?: OwnError;
  items: DynamicZoneArray<Input, 'error'>;
};

type DynamicZoneEntry<Input extends DynamicZoneInputComponents> = {
  rawData: DynamicZoneArray<Input, 'rawData'>;
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
