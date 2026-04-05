/* eslint-disable @typescript-eslint/no-unused-vars */

import { ComponentClientDataById } from './client/types.js';
import {
  ComponentId,
  ComponentInDataById,
  ComponentOptionsById,
} from './types.js';

export type ComponentPathDetails = {
  path: string | null;
  value: unknown;
};

export interface ComponentNestedPathMap<T, Args = unknown> extends Record<
  string,
  ComponentPathDetails
> {}

export interface ComponentNestedPathShapeMap<Args = unknown> extends Record<
  string,
  unknown
> {}

export type ComponentNestedPathDetails<
  T,
  Id extends ComponentId,
  Args = unknown,
> = ComponentNestedPathMap<T, Args>[Id];

export type ComponentNestedPath<
  T,
  Id extends ComponentId,
  Args = unknown,
> = ComponentNestedPathDetails<T, Id, Args>['path'];

export type ComponentNestedPathShape<
  Id extends ComponentId,
  Args = unknown,
> = ComponentNestedPathShapeMap<Args>[Id];

export type ParseComponentNestedPath<
  T,
  Path extends string,
  Id extends ComponentId,
  Args = unknown,
> = Extract<ComponentNestedPathMap<T, Args>[Id], { path: Path }>['value'];

type BaseComponentNestedPathExtends<Details, U> =
  Details extends ComponentPathDetails
    ? Details['value'] extends U
      ? Details['path']
      : never
    : never;

export type ComponentNestedPathExtends<
  T,
  U,
  Id extends ComponentId,
  Args = unknown,
> = BaseComponentNestedPathExtends<ComponentNestedPathMap<T, Args>[Id], U>;

export type ComponentInDataByIdPath<
  Id extends ComponentId,
  Args = unknown,
> = ComponentNestedPath<ComponentInDataById<Id, Args>, Id, Args>;

export type ComponentClientDataByIdPath<
  Id extends ComponentId,
  Args = unknown,
> = ComponentNestedPath<ComponentClientDataById<Id, Args>, Id, Args>;

export type ComponentInDataByIdPathExtends<
  U,
  Id extends ComponentId,
  Args = unknown,
> = ComponentNestedPathExtends<ComponentInDataById<Id, Args>, U, Id, Args>;

export type ComponentClientDataByIdPathExtends<
  U,
  Id extends ComponentId,
  Args = unknown,
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

export type ComponentPathWalkerApplyFn = <Id extends ComponentId, Args>(
  value: unknown,
  id: Id,
  options: ComponentOptionsById<Id, Args>
) => void;

export type ComponentPathWalker<Id extends ComponentId> = <Args>(
  data: ComponentNestedPathShape<Id, Args>,
  options: ComponentOptionsById<Id, Args>,
  path: ComponentNestedPath<ComponentNestedPathShape<Id, Args>, Id, Args>,
  apply: ComponentPathWalkerApplyFn,
  context: ForeignComponentPathWalkerContext
) => void;
