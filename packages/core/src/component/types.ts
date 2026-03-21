import { GetPropertyOr } from '@game-cms/shared';

export type ComponentDataAtom = unknown;
export type ComponentData =
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  ComponentDataAtom | ComponentData[] | { [K in string]: ComponentData };

export type ComponentOptions = ComponentData;

export type ComponentTypes = {
  outData: ComponentData;
  options: ComponentOptions;
  error: unknown;
};

export type ComponentEntry<T extends ComponentTypes> = T;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface ComponentTypeMap<_Args = unknown> extends Record<
  string,
  ComponentTypes
> {}

export type ComponentId = keyof ComponentTypeMap;

type GetOrRawData<Types extends ComponentTypes, K extends string> = {
  [U in K]: GetPropertyOr<Types, U, Types['outData']>;
};

type GetPartialName<T extends string> = `partial${Capitalize<T>}`;

type GetComponentExtendedTypes<Types extends ComponentTypes = ComponentTypes> =
  GetOrRawData<Types, 'inData' | 'resolvedData' | 'clientData' | 'storageData'>;

type GetComponentPartialTypes<Types extends ComponentTypes> = {
  [K in
    | 'outData'
    | keyof GetComponentExtendedTypes as GetPartialName<K>]: GetPropertyOr<
    Types,
    GetPartialName<K>,
    GetOrRawData<Types, K>[K]
  >;
};

type GetComponentSearchTypes<Types extends ComponentTypes> = {
  searchIndexData: GetPropertyOr<Types, 'searchIndexData', unknown>;
};

type GetComponentClientOptionsTypes<Types extends ComponentTypes> = {
  clientOptions: GetPropertyOr<Types, 'clientOptions', Types['options']>;
};

type GetComponentTypes<Types extends ComponentTypes = ComponentTypes> = Pick<
  Types,
  keyof ComponentTypes
> &
  GetComponentExtendedTypes<Types> &
  GetComponentPartialTypes<Types> &
  GetComponentSearchTypes<Types> &
  GetComponentClientOptionsTypes<Types>;

export type GetComponentTypesById<
  Id extends ComponentId,
  Args = unknown,
> = GetComponentTypes<ComponentTypeMap<Args>[Id]>;

export type ComponentOutDataById<
  T extends ComponentId,
  Args = unknown,
> = GetComponentTypesById<T, Args>['outData'];

export type ComponentInDataById<
  T extends ComponentId,
  Args = unknown,
> = GetComponentTypesById<T, Args>['inData'];

export type ComponentPartialInDataById<
  T extends ComponentId,
  Args = unknown,
> = GetComponentTypesById<T, Args>['partialInData'];

export type ComponentOptionsById<
  T extends ComponentId,
  Args = unknown,
> = GetComponentTypesById<T, Args>['options'];

export type ComponentClientOptionsById<
  T extends ComponentId,
  Args = unknown,
> = GetComponentTypesById<T, Args>['clientOptions'];

export type ComponentErrorById<
  T extends ComponentId,
  Args = unknown,
> = GetComponentTypesById<T, Args>['error'];
