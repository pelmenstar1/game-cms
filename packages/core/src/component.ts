import type {
  AnyKeyInObject,
  IdSource,
  IsAllOptional,
  MaybePromise,
  RequiredIf,
} from '@game-cms/shared';
import type { Key, ReactNode } from 'react';

import type { RequestContext } from './apiClient.js';

type MaybePromiseWithMarker<T> =
  | (T & { $asyncMarker?: never })
  | MaybePromise<T>;

export type ComponentDataAtom = unknown;
export type ComponentData =
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  ComponentDataAtom | ComponentData[] | { [K in string]: ComponentData };

export type ComponentOptions = ComponentData;

export type ComponentTypes = {
  rawData: ComponentData;
  options: ComponentOptions;
  error: unknown;
};

export type ComponentEntry<T extends ComponentTypes> = T;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars
export interface ComponentTypeMap<_Args = unknown> extends Record<
  string,
  ComponentTypes
> {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars
export interface ComponentNestedPathMap<T, Args = unknown> extends Record<
  string,
  string | null
> {}

export type ComponentId = keyof ComponentTypeMap;

type GetOrRawData<Types extends ComponentTypes, K extends string> = {
  [U in K]: Types extends Record<U, unknown> ? Types[U] : Types['rawData'];
};

type GetComponentTypes<Types extends ComponentTypes> = Pick<
  Types,
  keyof ComponentTypes
> &
  GetOrRawData<
    Types,
    'rawInData' | 'resolvedData' | 'clientData' | 'storageData'
  >;

type GetComponentTypesById<
  Id extends ComponentId,
  Args = unknown,
> = GetComponentTypes<ComponentTypeMap<Args>[Id]>;

export type ComponentStorageDataById<
  T extends ComponentId,
  Args = unknown,
> = GetComponentTypesById<T, Args>['storageData'];

export type ComponentRawDataById<
  T extends ComponentId,
  Args = unknown,
> = GetComponentTypesById<T, Args>['rawData'];

export type ComponentRawInDataById<
  T extends ComponentId,
  Args = unknown,
> = GetComponentTypesById<T, Args>['rawInData'];

export type ComponentResolvedDataById<
  T extends ComponentId,
  Args = unknown,
> = GetComponentTypesById<T, Args>['resolvedData'];

export type ComponentClientDataById<
  T extends ComponentId,
  Args = unknown,
> = GetComponentTypesById<T, Args>['clientData'];

export type ComponentOptionsById<
  T extends ComponentId,
  Args = unknown,
> = GetComponentTypesById<T, Args>['options'];

export type ComponentErrorById<
  T extends ComponentId,
  Args = unknown,
> = GetComponentTypesById<T, Args>['error'];

export type ComponentNestedPath<T, Id extends ComponentId, Args = unknown> =
  ComponentNestedPathMap<T, Args> extends Record<
    Id,
    infer R extends { path: string }
  >
    ? R['path']
    : string;

export type ComponentRawInDataByIdPath<
  Id extends ComponentId,
  Args,
> = ComponentNestedPath<ComponentRawInDataById<Id, Args>, Id, Args>;

export type ComponentSchema<
  Id extends ComponentId = ComponentId,
  Args = unknown,
> = {
  componentId: Id;
  options: ComponentOptionsById<Id, Args>;
};

export type ComponentSchemaNestedPath<T, Schema> =
  Schema extends ComponentSchema<infer Id, infer Args>
    ? ComponentNestedPath<T, Id, Args>
    : string;

export type GetComponentSchemaTypes<Schema = unknown> =
  Schema extends ComponentSchema<infer Id, infer Args>
    ? GetComponentTypesById<Id, Args> & {
        componentId: Id;
      }
    : {
        rawData: ComponentData;
        rawInData: ComponentData;
        resolvedData: ComponentData;
        storageData: ComponentData;
        clientData: ComponentData;
        options: ComponentOptions;
        error: unknown;
        componentId: ComponentId;
      };

export type ComponentProps<Id extends ComponentId, Args> = {
  data: ComponentClientDataById<Id, Args>;
  options: ComponentOptionsById<Id, Args>;
  error?: ComponentErrorById<Id, Args>;
  onDataChanged?: (data: ComponentClientDataById<Id, Args>) => void;
};

export type ComponentRenderer<Id extends ComponentId = ComponentId> = <
  Args = unknown,
>(
  props: ComponentProps<Id, Args>
) => ReactNode;

export type ForeignComponentValidationContext = {
  validate: <Id extends ComponentId, Args>(
    id: Id,
    data: unknown,
    options: ComponentOptionsById<Id, Args>
  ) => ComponentErrorById<Id, Args> | undefined;
};

export type ForeignComponentDefaultDataContext = {
  getDefaultData: <Id extends ComponentId, Args>(
    id: Id,
    options: ComponentOptionsById<Id, Args>
  ) => ComponentRawDataById<Id, Args>;
};

export type ForeignComponentDataResolverContext = {
  resolveRawData: <Id extends ComponentId, Args>(
    id: Id,
    data: ComponentRawDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>,
    args: ComponentDataResolverArgs
  ) => ComponentResolvedDataById<Id>;
};

export type ForeignComponentClientDataResolverContext = {
  idSource: IdSource<Key>;

  getDefaultData: <Id extends ComponentId, Args>(
    id: Id,
    options: ComponentOptionsById<Id, Args>
  ) => ComponentClientDataById<Id, Args>;

  makeRequest: <Args extends unknown[], R>(
    fn: (context: RequestContext, ...args: Args) => Promise<R>,
    args: Args
  ) => Promise<R>;

  toClient: <Id extends ComponentId, Args>(
    id: Id,
    data: ComponentRawDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>
  ) => ComponentClientDataById<Id, Args>;

  fromClient: <Id extends ComponentId, Args>(
    id: Id,
    clientData: ComponentClientDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>
  ) => ComponentRawInDataOrError<Id, Args>;
};

export type ForeignComponentClientDefaultDataContext = Pick<
  ForeignComponentClientDataResolverContext,
  'getDefaultData'
>;

export interface ForeignComponentStorageDataResolverContext extends ForeignComponentPathWalkerContext {
  toStorage: <Id extends ComponentId, Args>(
    id: Id,
    data: ComponentRawInDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>
  ) => MaybePromiseWithMarker<ComponentStorageDataById<Id, Args>>;

  fromStorage: <Id extends ComponentId, Args>(
    id: Id,
    data: ComponentStorageDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>
  ) => MaybePromiseWithMarker<ComponentRawDataById<Id, Args>>;
}

export type ComponentDataValidator<Id extends ComponentId> = <Args = unknown>(
  data: unknown,
  options: ComponentOptionsById<Id, Args>,
  context: ForeignComponentValidationContext
) => ComponentErrorById<Id, Args> | undefined;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ComponentDataResolverArgs {}

export type ComponentDataResolver<Id extends ComponentId> = <Args>(
  raw: ComponentRawDataById<Id, Args>,
  options: ComponentOptionsById<Id, Args>,
  context: ForeignComponentDataResolverContext,
  args: ComponentDataResolverArgs
) => ComponentResolvedDataById<Id, Args>;

export type ComponentRawInDataOrError<Id extends ComponentId, Args = unknown> =
  | { result: ComponentRawInDataById<Id, Args>; error?: undefined }
  | { result?: undefined; error: ComponentErrorById<Id, Args> };

export type ComponentClientDataTransformer<Id extends ComponentId> = {
  getDefaultData: <Args>(
    options: ComponentOptionsById<Id, Args>,
    context: ForeignComponentClientDefaultDataContext
  ) => ComponentClientDataById<Id, Args>;

  toClient: <Args>(
    data: ComponentRawDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>,
    context: ForeignComponentClientDataResolverContext
  ) => ComponentClientDataById<Id, Args>;

  fromClient: <Args>(
    clientData: ComponentClientDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>,
    context: ForeignComponentClientDataResolverContext
  ) => ComponentRawInDataOrError<Id, Args>;
};

export type ComponentStorageDataTransformer<Id extends ComponentId> = {
  toStorage: <Args>(
    data: ComponentRawInDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>,
    context: ForeignComponentStorageDataResolverContext
  ) => MaybePromiseWithMarker<ComponentStorageDataById<Id, Args>>;

  fromStorage: <Args>(
    data: ComponentStorageDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>,
    context: ForeignComponentStorageDataResolverContext
  ) => MaybePromiseWithMarker<ComponentRawDataById<Id, Args>>;
};

export type ComponentDefaultDataHandler<Id extends ComponentId> = <Args>(
  options: ComponentOptionsById<Id, Args>,
  context: ForeignComponentDefaultDataContext
) => ComponentRawDataById<Id, Args>;

export type ForeignComponentPathWalkerContext = {
  applyAtPath: <Id extends ComponentId, Args>(
    id: ComponentId,
    data: ComponentRawInDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>,
    path: ComponentRawInDataByIdPath<Id, Args>,
    apply: ComponentPathWalkerApplyFn
  ) => void;
};

export const COMPONENT_WALK_NOT_FOUND = Symbol();

export type ComponentPathWalkerApplyFn = (value: unknown) => void;

export type ComponentPathWalker<Id extends ComponentId> = <Args>(
  data: ComponentRawInDataById<Id, Args>,
  options: ComponentOptionsById<Id, Args>,
  path: ComponentRawInDataByIdPath<Id, Args>,
  apply: ComponentPathWalkerApplyFn,
  context: ForeignComponentPathWalkerContext
) => void;

export type ComponentMeta = {
  ui?: {
    compact?: boolean;
  };
};

export type ComponentCore<Id extends ComponentId = ComponentId> = {
  id: Id;
  meta?: ComponentMeta;
  defaultRawData: ComponentDefaultDataHandler<Id>;
  validator: ComponentDataValidator<Id>;
};

interface BaseComponentController<Id extends ComponentId = ComponentId> {
  core: ComponentCore<Id>;
}

type RequiredIfExists<
  T,
  Id extends ComponentId,
  K extends PropertyKey,
> = RequiredIf<T, AnyKeyInObject<ComponentTypeMap[Id], K>>;

export type ComponentController<Id extends ComponentId = ComponentId> =
  BaseComponentController<Id> &
    RequiredIfExists<
      { resolver?: ComponentDataResolver<Id> },
      Id,
      'resolvedData'
    > &
    RequiredIfExists<
      { storageTransformer?: ComponentStorageDataTransformer<Id> },
      Id,
      'storageData' | 'rawInData'
    > &
    RequiredIfExists<
      { pathWalker?: ComponentPathWalker<Id> },
      Id,
      'nestedPath'
    >;

export type ComponentControllerMap = {
  [Id in keyof ComponentTypeMap]: ComponentController<Id>;
};

export type ComponentClientModule<Id extends ComponentId = ComponentId> = {
  renderer: ComponentRenderer<Id>;
};

type ComponentAccessor<Id extends ComponentId> =
  IsAllOptional<ComponentOptionsById<Id>> extends true
    ? <Args>(
        input?: ComponentOptionsById<Id, Args>
      ) => ComponentSchema<Id, Args>
    : <Args>(
        input: ComponentOptionsById<Id, Args>
      ) => ComponentSchema<Id, Args>;

/*@__NO_SIDE_EFFECTS__*/
export function componentController<Id extends ComponentId>(
  value: ComponentController<Id>
) {
  return value;
}

/*@__NO_SIDE_EFFECTS__*/
export function componentAccessor<Id extends string>(
  controller: ComponentController<Id>
): ComponentAccessor<Id> {
  return (options = {}) => {
    return { componentId: controller.core.id, options };
  };
}

/*@__NO_SIDE_EFFECTS__*/
export function componentCore<Id extends string>(value: ComponentCore<Id>) {
  return value;
}
