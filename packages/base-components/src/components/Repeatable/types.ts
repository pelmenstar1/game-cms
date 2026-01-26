import {
  ComponentEntry,
  ComponentId,
  ComponentNestedPath,
  ComponentSchema,
  GetComponentSchemaTypes,
} from '@game-cms/core';
import { Key } from 'react';

import { TitleSpecById } from '../../internal/title.js';

export type RepeatableArgs<Id = ComponentId, BaseArgs = unknown> = {
  id: Id;
  baseArgs: BaseArgs;
};

type ResolveArgs<Args> = Args extends RepeatableArgs ? Args : RepeatableArgs;

type BaseRepeatableEntry<Types extends GetComponentSchemaTypes> = {
  options: {
    componentId: Types['componentId'];
    title?: TitleSpecById<Types['componentId'], Types['args']>;
    baseOptions: Types['options'];
  };
  error: {
    ownError?: 'INVALID_TYPE';
    items?: (Types['error'] | undefined)[];
  };
  resolvedData: Types['resolvedData'][];
  rawData: Types['rawData'][];
  rawInData: Types['rawInData'][];
  clientData: {
    clientKey: Key;
    data: Types['clientData'];
  }[];
  storageData: Types['storageData'][];
};

type RepeatableEntry<Args extends RepeatableArgs> = BaseRepeatableEntry<
  GetComponentSchemaTypes<ComponentSchema<Args['id'], Args['baseArgs']>>
>;

type BaseNestedPath<T, Args extends RepeatableArgs> = {
  path: ComponentNestedPath<T, Args['id'], Args['baseArgs']>;
};

declare module '@game-cms/core' {
  interface ComponentTypeMap<_Args> {
    'base::repeatable': ComponentEntry<RepeatableEntry<ResolveArgs<_Args>>>;
  }

  interface ComponentNestedPathMap<T, Args> {
    'base::repeatable': BaseNestedPath<T, ResolveArgs<Args>>;
  }
}
