/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  AnyKeyInObject,
  GetPropertyOr,
  IdSource,
  IsAllOptional,
  MaybePromise,
  RequiredIf,
  ResultOrError,
} from '@game-cms/shared';
import type { Key, ReactNode } from 'react';

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

export interface ComponentTypeMap<_Args = unknown> extends Record<
  string,
  ComponentTypes
> {}

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

export type ComponentId = keyof ComponentTypeMap;

type GetOrRawData<Types extends ComponentTypes, K extends string> = {
  [U in K]: GetPropertyOr<Types, U, Types['rawData']>;
};

type GetPartialName<T extends string> = `partial${Capitalize<T>}`;

type GetComponentExtendedTypes<Types extends ComponentTypes = ComponentTypes> =
  GetOrRawData<
    Types,
    'rawInData' | 'resolvedData' | 'clientData' | 'storageData'
  >;

type GetComponentPartialTypes<Types extends ComponentTypes> = {
  [K in
    | 'rawData'
    | keyof GetComponentExtendedTypes as GetPartialName<K>]: GetPropertyOr<
    Types,
    GetPartialName<K>,
    GetOrRawData<Types, K>[K]
  >;
};

type GetComponentSearchTypes<Types extends ComponentTypes> = {
  searchIndexData: GetPropertyOr<Types, 'searchIndexData', unknown>;
};

type GetComponentTypes<Types extends ComponentTypes = ComponentTypes> = Pick<
  Types,
  keyof ComponentTypes
> &
  GetComponentExtendedTypes<Types> &
  GetComponentPartialTypes<Types> &
  GetComponentSearchTypes<Types>;

type GetComponentTypesById<
  Id extends ComponentId,
  Args = unknown,
> = GetComponentTypes<ComponentTypeMap<Args>[Id]>;

export type ComponentStorageDataById<
  T extends ComponentId,
  Args = unknown,
> = GetComponentTypesById<T, Args>['storageData'];

export type ComponentStoragePartialDataById<
  T extends ComponentId,
  Args = unknown,
> = GetComponentTypesById<T, Args>['partialStorageData'];

export type ComponentRawDataById<
  T extends ComponentId,
  Args = unknown,
> = GetComponentTypesById<T, Args>['rawData'];

export type ComponentRawInDataById<
  T extends ComponentId,
  Args = unknown,
> = GetComponentTypesById<T, Args>['rawInData'];

export type ComponentRawInPartialDataById<
  T extends ComponentId,
  Args = unknown,
> = GetComponentTypesById<T, Args>['partialRawInData'];

export type ComponentResolvedDataById<
  T extends ComponentId,
  Args = unknown,
> = GetComponentTypesById<T, Args>['resolvedData'];

export type ComponentClientDataById<
  T extends ComponentId,
  Args = unknown,
> = GetComponentTypesById<T, Args>['clientData'];

export type ComponentSearchIndexDataById<
  T extends ComponentId,
  Args = unknown,
> = GetPropertyOr<ComponentTypeMap<Args>[T], 'searchIndexData', unknown>;

export type ComponentOptionsById<
  T extends ComponentId,
  Args = unknown,
> = GetComponentTypesById<T, Args>['options'];

export type ComponentErrorById<
  T extends ComponentId,
  Args = unknown,
> = GetComponentTypesById<T, Args>['error'];

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
        args: Args;
      }
    : {
        rawData: ComponentData;
        rawInData: ComponentData;
        partialRawInData: ComponentData;
        resolvedData: ComponentData;
        storageData: ComponentData;
        partialStorageData: ComponentData;
        clientData: ComponentData;
        searchIndexData: unknown;
        options: ComponentOptions;
        error: unknown;
        componentId: ComponentId;
        args: unknown;
      };

export type ComponentProps<Id extends ComponentId, Args> = {
  data: ComponentClientDataById<Id, Args>;
  options: ComponentOptionsById<Id, Args>;
  error?: ComponentErrorById<Id, Args>;
  readonly?: boolean;
  onDataChanged?: (data: ComponentClientDataById<Id, Args>) => void;
};

export type ComponentRenderer<Id extends ComponentId = ComponentId> = <
  Args = unknown,
>(
  props: ComponentProps<Id, Args>
) => ReactNode;

export type ComponentDataValidatorParams = {
  partial?: boolean;
};

export type ForeignComponentValidationContext = {
  validate: <Id extends ComponentId, Args>(
    id: Id,
    data: unknown,
    options: ComponentOptionsById<Id, Args>,
    params?: ComponentDataValidatorParams
  ) => ComponentErrorById<Id, Args> | undefined;
};

export type ComponentDataValidator<Id extends ComponentId> = <Args = unknown>(
  data: unknown,
  options: ComponentOptionsById<Id, Args>,
  context: ForeignComponentValidationContext,
  params?: ComponentDataValidatorParams
) => ComponentErrorById<Id, Args> | undefined;

export interface ComponentDataResolverArgs {}

export type ForeignComponentDataResolverContext = {
  resolveRawData: <Id extends ComponentId, Args>(
    id: Id,
    data: ComponentRawDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>,
    args: ComponentDataResolverArgs
  ) => ComponentResolvedDataById<Id>;
};

export type ComponentDataResolver<Id extends ComponentId> = <Args>(
  raw: ComponentRawDataById<Id, Args>,
  options: ComponentOptionsById<Id, Args>,
  context: ForeignComponentDataResolverContext,
  args: ComponentDataResolverArgs
) => ComponentResolvedDataById<Id, Args>;

export type ComponentRawInDataOrError<
  Id extends ComponentId,
  Args = unknown,
> = ResultOrError<
  ComponentRawInDataById<Id, Args>,
  ComponentErrorById<Id, Args>
>;

export type ForeignComponentClientDataResolverContext = {
  idSource: IdSource<Key>;
  validation: ForeignComponentValidationContext;

  getDefaultData: <Id extends ComponentId, Args>(
    id: Id,
    options: ComponentOptionsById<Id, Args>
  ) => ComponentClientDataById<Id, Args>;

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

export type ComponentClientDataTransformer<
  Id extends ComponentId = ComponentId,
> = {
  /**
   * Determines whether fromClient will its own validation scheme.
   */
  ownValidation?: boolean;

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

export interface ForeignComponentStorageDataResolverContext extends ForeignComponentPathWalkerContext {
  getDefaultData: <Id extends ComponentId, Args>(
    id: Id,
    options: ComponentOptionsById<Id, Args>
  ) => ComponentStorageDataById<Id, Args>;

  toStorage: <Id extends ComponentId, Args>(
    id: Id,
    data: ComponentRawInDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>
  ) => MaybePromise<ComponentStorageDataById<Id, Args>>;

  fromStorage: <Id extends ComponentId, Args>(
    id: Id,
    data: ComponentStorageDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>
  ) => MaybePromise<ComponentRawDataById<Id, Args>>;
}

export type ComponentStorageDataTransformer<Id extends ComponentId> = {
  getDefaultData: <Args>(
    options: ComponentOptionsById<Id, Args>,
    context: ForeignComponentStorageDataResolverContext
  ) => ComponentStorageDataById<Id, Args>;

  toStorage: <Args>(
    data: ComponentRawInDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>,
    context: ForeignComponentStorageDataResolverContext
  ) => MaybePromise<ComponentStorageDataById<Id, Args>>;

  fromStorage: <Args>(
    data: ComponentStorageDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>,
    context: ForeignComponentStorageDataResolverContext
  ) => MaybePromise<ComponentRawDataById<Id, Args>>;
};

export type ForeignComponentDefaultRawDataContext = {
  getDefaultData: <Id extends ComponentId, Args>(
    id: Id,
    options: ComponentOptionsById<Id, Args>
  ) => ComponentRawDataById<Id, Args>;
};

export type ComponentDefaultDataHandler<Id extends ComponentId> = <Args>(
  options: ComponentOptionsById<Id, Args>,
  context: ForeignComponentDefaultRawDataContext
) => ComponentRawDataById<Id, Args>;

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

export interface ForeignComponentDataMigrationContext {
  migrate: <Id extends ComponentId, Args>(
    id: Id,
    data: unknown,
    options: ComponentOptionsById<Id, Args>
  ) => ComponentStorageDataById<Id, Args>;
}

export type ComponentDataMigration<Id extends ComponentId> = <Args>(
  data: unknown,
  options: ComponentOptionsById<Id, Args>,
  context: ForeignComponentDataMigrationContext
) => ComponentStorageDataById<Id, Args> | undefined;

export interface ForeignComponentDataMergeContext {
  merge: <Id extends ComponentId, Args>(
    id: Id,
    target: ComponentStorageDataById<Id, Args>,
    source: ComponentRawInPartialDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>
  ) => MaybePromise<ComponentStorageDataById<Id, Args>>;
}

export type ComponentDataMergeHandler<Id extends ComponentId> = <Args>(
  target: ComponentStorageDataById<Id, Args>,
  source: ComponentRawInPartialDataById<Id, Args>,
  options: ComponentOptionsById<Id, Args>,
  context: ForeignComponentDataMergeContext
) => MaybePromise<ComponentStorageDataById<Id, Args>>;

export type ComponentMeta = {
  ui?: {
    compact?: boolean;
  };
};

type BaseComponentCore<Id extends ComponentId = ComponentId> = {
  id: Id;
  meta?: ComponentMeta;
  defaultRawData: ComponentDefaultDataHandler<Id>;
  validator: ComponentDataValidator<Id>;
};

export type ComponentCore<Id extends ComponentId = ComponentId> =
  BaseComponentCore<Id> &
    RequiredIf<
      { pathWalker?: ComponentPathWalker<Id> },
      AnyKeyInObject<ComponentNestedPathMap<unknown>, Id>
    >;

export type ComponentDataStructure =
  | string
  | number
  | ComponentDataStructure[]
  | {
      [K in string]: ComponentDataStructure;
    };

export interface ForeignComponentDataStructureContext {
  getStructure: <Id extends ComponentId, Args>(
    id: Id,
    options: ComponentOptionsById<Id, Args>
  ) => ComponentDataStructure;
}

export type ComponentDataStructureSource<Id extends ComponentId> =
  | ComponentDataStructure
  | (<Args>(
      options: ComponentOptionsById<Id, Args>,
      context: ForeignComponentDataStructureContext
    ) => ComponentDataStructure);

type RequiredIfExists<
  T,
  Id extends ComponentId,
  K extends PropertyKey,
  Args = unknown,
> = RequiredIf<T, AnyKeyInObject<ComponentTypeMap<Args>[Id], K>>;

export type ComponentDataSearchTarget<
  Id extends ComponentId,
  Args = unknown,
> = {
  storage: ComponentStorageDataById<Id, Args>;
} & RequiredIfExists<
  { searchIndex?: ComponentSearchIndexDataById<Id, Args> },
  Id,
  'searchIndexData',
  Args
>;

export interface ForeignComponentDataSearchContext {
  getScore: <Id extends ComponentId, Args>(
    query: string,
    id: Id,
    target: ComponentDataSearchTarget<Id, Args>,
    options: ComponentOptionsById<Id, Args>
  ) => number;

  createSearchIndex: <Id extends ComponentId, Args>(
    id: Id,
    data: ComponentStorageDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>
  ) => ComponentSearchIndexDataById<Id, Args>;
}

export type ComponentDataSearchScoreFn<Id extends ComponentId> = <Args>(
  query: string,
  target: ComponentDataSearchTarget<Id, Args>,
  options: ComponentOptionsById<Id, Args>,
  context: ForeignComponentDataSearchContext
) => number;

export type ComponentDataSearchIndexFn<Id extends ComponentId> = <Args>(
  data: ComponentStorageDataById<Id, Args>,
  options: ComponentOptionsById<Id, Args>,
  context: ForeignComponentDataSearchContext
) => ComponentSearchIndexDataById<Id, Args>;

export type ComponentSearchController<Id extends ComponentId = ComponentId> = {
  getScore: ComponentDataSearchScoreFn<Id>;
} & RequiredIfExists<
  { createIndex?: ComponentDataSearchIndexFn<Id> },
  Id,
  'searchIndexData'
>;

interface BaseComponentController<Id extends ComponentId = ComponentId> {
  core: ComponentCore<Id>;
  structure?: ComponentDataStructureSource<Id>;
  migrate?: ComponentDataMigration<Id>;
}

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
      { mergeData?: ComponentDataMergeHandler<Id> },
      Id,
      'partialRawInData'
    > &
    RequiredIfExists<
      { search?: ComponentSearchController<Id> },
      Id,
      'searchIndexData'
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
export function defineComponentController<Id extends ComponentId>(
  value: ComponentController<Id>
) {
  return value;
}

/*@__NO_SIDE_EFFECTS__*/
export function componentAccessor<Id extends string>(
  componentId: Id
): ComponentAccessor<Id> {
  return (options = {}) => {
    return { componentId, options };
  };
}

/*@__NO_SIDE_EFFECTS__*/
export function defineComponentCore<Id extends string>(
  value: ComponentCore<Id>
) {
  return value;
}
