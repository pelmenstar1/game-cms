import {
  ComponentClientDataById,
  ComponentDataById,
  ComponentEntry,
  ComponentErrorById,
  ComponentId,
  ComponentOptionsById,
  ComponentResolvedDataById,
} from '@game-cms/types';
import { Key } from 'react';

type RepeatableArgs<Id = ComponentId, BaseArgs = unknown> = {
  id: Id;
  baseArgs: BaseArgs;
};

type ResolveArgs<Args> = Args extends {
  componentId: infer Id extends ComponentId;
  baseArgs: infer BaseArgs;
}
  ? RepeatableArgs<Id, BaseArgs>
  : RepeatableArgs;

type RepeatableEntry<Args extends RepeatableArgs> = {
  data: ComponentDataById<Args['id'], Args['baseArgs']>[];
  options: {
    componentId: Args['id'];
    baseOptions: ComponentOptionsById<Args['id'], Args['baseArgs']>;
  };
  error: (ComponentErrorById<Args['id'], Args['baseArgs']> | undefined)[];
  resolvedData: ComponentResolvedDataById<Args['id'], Args['baseArgs']>[];
  clientData: {
    clientKey: Key;
    data: ComponentClientDataById<Args['id'], Args['baseArgs']>;
  }[];
};

declare module '@game-cms/types' {
  interface ComponentTypeMap<_Args> {
    'base::repeatable': ComponentEntry<RepeatableEntry<ResolveArgs<_Args>>>;
  }
}
