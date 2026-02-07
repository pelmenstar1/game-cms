/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */

import { ComponentClientDataById } from './client.js';
import {
  ComponentId,
  ComponentOptionsById,
  ComponentRawInDataById,
} from './types.js';

export interface ComponentNestedPathMap<T, Args = unknown> extends Record<
  string,
  { path: string | null }
> {}

export interface ComponentNestedPathShapeMap<Args = unknown> extends Record<
  string,
  unknown
> {}

export interface ComponentNestedPathParserMap<
  T,
  Path extends string,
  Args = unknown,
> extends Record<string, unknown> {}

export type ComponentNestedPath<T, Id extends ComponentId, Args = unknown> =
  ComponentNestedPathMap<T, Args> extends Record<Id, { path: string }>
    ? ComponentNestedPathMap<T, Args>[Id]['path']
    : string;

export type ComponentNestedPathShape<
  Id extends ComponentId,
  Args = unknown,
> = ComponentNestedPathShapeMap<Args>[Id];

export type ParseComponentNestedPath<
  T,
  Path extends string,
  Id extends ComponentId,
  Args = unknown,
> = ComponentNestedPathParserMap<T, Path, Args>[Id];

type BaseComponentNestedPathExtends<
  T,
  U,
  Path extends string,
  Id extends ComponentId,
  Args = unknown,
> = {
  [K in Path]: ParseComponentNestedPath<T, K, Id, Args> extends U ? K : never;
}[Path];

export type ComponentNestedPathExtends<
  T,
  U,
  Id extends ComponentId,
  Args = unknown,
> = BaseComponentNestedPathExtends<
  T,
  U,
  ComponentNestedPath<T, Id, Args>,
  Id,
  Args
>;

export type ComponentRawInDataByIdPath<
  Id extends ComponentId,
  Args,
> = ComponentNestedPath<ComponentRawInDataById<Id, Args>, Id, Args>;

export type ComponentClientDataByIdPath<
  Id extends ComponentId,
  Args,
> = ComponentNestedPath<ComponentClientDataById<Id, Args>, Id, Args>;

export type ComponentRawInDataByIdPathExtends<
  U,
  Id extends ComponentId,
  Args,
> = ComponentNestedPathExtends<ComponentRawInDataById<Id, Args>, U, Id, Args>;

export type ComponentClientDataByIdPathExtends<
  U,
  Id extends ComponentId,
  Args,
> = ComponentNestedPathExtends<ComponentClientDataById<Id, Args>, U, Id, Args>;

export type ComponentNestedPathDot<
  T extends string,
  Suffix,
> = string extends Suffix
  ? T
  : Suffix extends string
    ? T | `${T}.${Suffix}`
    : T;

export type ForeignComponentPathWalkerContext = {
  applyAtPath: <
    Id extends ComponentId,
    Args,
    T extends ComponentNestedPathShape<Id, Args>,
  >(
    id: ComponentId,
    data: T,
    options: ComponentOptionsById<Id, Args>,
    path: ComponentNestedPath<T, Id, Args>,
    apply: ComponentPathWalkerApplyFn
  ) => void;
};

export type ComponentPathWalkerApplyFn = (value: unknown) => void;

export type ComponentPathWalker<Id extends ComponentId> = <Args>(
  data: ComponentNestedPathShape<Id, Args>,
  options: ComponentOptionsById<Id, Args>,
  path: ComponentNestedPath<ComponentNestedPathShape<Id, Args>, Id, Args>,
  apply: ComponentPathWalkerApplyFn,
  context: ForeignComponentPathWalkerContext
) => void;
