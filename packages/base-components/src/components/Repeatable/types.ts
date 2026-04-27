import {
  ComponentEntry,
  ComponentId,
  ComponentNestedPathDetails,
  ComponentNestedPathShape,
  ComponentSchema,
  GetComponentSchemaTypes,
} from '@game-cms/core';
import { IfExtends, UnpackArray } from '@game-cms/shared';
import { Key } from 'react';

import { TitleSpecById } from '../../internal/title.js';
import { id } from './internal/types.js';

export type RepeatableArgs<Id = ComponentId, BaseArgs = unknown> = {
  id: Id;
  baseArgs: BaseArgs;
};

type ResolveArgs<Args> = IfExtends<Args, RepeatableArgs>;

type BaseOptions<
  Types extends GetComponentSchemaTypes,
  OptKey extends keyof GetComponentSchemaTypes,
> = {
  componentId: Types['componentId'];
  title?: TitleSpecById<Types['componentId'], Types['args']>;
  baseOptions: Types[OptKey];
};

type BaseRepeatableEntry<Types extends GetComponentSchemaTypes> = {
  options: BaseOptions<Types, 'options'>;
  clientOptions: BaseOptions<Types, 'clientOptions'>;
  error: {
    ownError?: 'INVALID_TYPE';
    items?: (Types['error'] | undefined)[];
  };
  resolvedData: Types['resolvedData'][];
  outData: Types['outData'][];
  inData: Types['inData'][];
  clientData: {
    clientKey: Key;
    data: Types['clientData'];
  }[];
  storageData: Types['storageData'][];
  searchIndexData: Types['searchIndexData'][];
  isContainer: true;
};

type RepeatableEntry<Args extends RepeatableArgs> = BaseRepeatableEntry<
  GetComponentSchemaTypes<ComponentSchema<Args['id'], Args['baseArgs']>>
>;

type BaseNestedPath<
  T,
  Args extends RepeatableArgs,
> = ComponentNestedPathDetails<UnpackArray<T>, Args['id'], Args['baseArgs']>;

type BaseNestedPathShape<Args extends RepeatableArgs> =
  ComponentNestedPathShape<Args['id'], Args['baseArgs']>[];

declare module '@game-cms/core' {
  interface ComponentTypeMap<Args> {
    [id]: ComponentEntry<RepeatableEntry<ResolveArgs<Args>>>;
  }

  interface ComponentNestedPathMap<T, Args> {
    [id]: BaseNestedPath<T, ResolveArgs<Args>>;
  }

  interface ComponentNestedPathShapeMap<Args> {
    [id]: BaseNestedPathShape<ResolveArgs<Args>>;
  }
}
