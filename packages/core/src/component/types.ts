import { GetPropertyOr } from '@game-cms/shared';

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

export type GetComponentTypesById<
  Id extends ComponentId,
  Args = unknown,
> = GetComponentTypes<ComponentTypeMap<Args>[Id]>;

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

export type ComponentOptionsById<
  T extends ComponentId,
  Args = unknown,
> = GetComponentTypesById<T, Args>['options'];

export type ComponentErrorById<
  T extends ComponentId,
  Args = unknown,
> = GetComponentTypesById<T, Args>['error'];
