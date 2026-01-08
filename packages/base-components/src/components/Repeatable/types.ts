import {
  ComponentClientDataById,
  ComponentEntry,
  ComponentErrorById,
  ComponentId,
  ComponentNestedPath,
  ComponentOptionsById,
  ComponentRawDataById,
  ComponentRawInDataById,
  ComponentResolvedDataById,
  ComponentStorageDataById,
} from '@game-cms/core';
import { Key } from 'react';

import { TitleSpecById } from '../../internal/title.js';

export type RepeatableArgs<Id = ComponentId, BaseArgs = unknown> = {
  id: Id;
  baseArgs: BaseArgs;
};

type ResolveArgs<Args> = Args extends RepeatableArgs ? Args : RepeatableArgs;

type RepeatableEntry<Args extends RepeatableArgs> = {
  options: {
    componentId: Args['id'];
    title?: TitleSpecById<Args['id'], Args['baseArgs']>;
    baseOptions: ComponentOptionsById<Args['id'], Args['baseArgs']>;
  };
  error: {
    ownError?: 'INVALID_TYPE';
    items?: (ComponentErrorById<Args['id'], Args['baseArgs']> | undefined)[];
  };
  resolvedData: ComponentResolvedDataById<Args['id'], Args['baseArgs']>[];
  rawData: ComponentRawDataById<Args['id'], Args['baseArgs']>[];
  rawInData: ComponentRawInDataById<Args['id'], Args['baseArgs']>[];
  clientData: {
    clientKey: Key;
    data: ComponentClientDataById<Args['id'], Args['baseArgs']>;
  }[];
  storageData: ComponentStorageDataById<Args['id'], Args['baseArgs']>[];
};

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
