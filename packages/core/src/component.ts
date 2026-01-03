import type { IdSource, MaybePromise, Or } from '@game-cms/shared';
import type { Key, ReactNode } from 'react';

import type { RequestContext } from './apiClient.js';

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

export type ComponentSchema<
  Id extends ComponentId = ComponentId,
  Args = unknown,
> = {
  componentId: Id;
  options: ComponentOptionsById<Id, Args>;
};

type GetOrRawData<T extends ComponentTypes, K extends string> =
  T extends Record<K, unknown> ? T[K] : T['rawData'];

type GetComponentTypes<Types extends ComponentTypes> = {
  options: Types['options'];
  error: Types['error'];
  rawData: Types['rawData'];
  resolvedData: GetOrRawData<Types, 'resolvedData'>;
  clientData: GetOrRawData<Types, 'clientData'>;
  storageData: GetOrRawData<Types, 'storageData'>;
};

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

export type ComponentControllerConfig = {
  ui?: {
    compact?: boolean;
  };
};

export type ForeignComponentValidationContext = {
  validate: <Id extends ComponentId, Args>(
    id: Id,
    data: ComponentRawDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>
  ) => ComponentErrorById<Id, Args> | undefined;
};

export type ForeignComponentDefaultDataContext = {
  getDefault: <Id extends ComponentId, Args>(
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
  ) => MaybePromise<ComponentClientDataById<Id, Args>>;

  fromClient: <Id extends ComponentId, Args>(
    id: Id,
    clientData: ComponentClientDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>
  ) => Or<
    { result: ComponentRawDataById<Id, Args> },
    { error: ComponentErrorById<Id, Args> }
  >;
};

export type ForeignComponentStorageDataResolverContext = {
  toStorage: <Id extends ComponentId, Args>(
    id: Id,
    data: ComponentRawDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>
  ) => MaybePromise<ComponentStorageDataById<Id, Args>>;

  fromStorage: <Id extends ComponentId, Args>(
    id: Id,
    data: ComponentStorageDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>
  ) => MaybePromise<ComponentRawDataById<Id, Args>>;
};

export type ComponentDataValidator<Id extends ComponentId> = <Args = unknown>(
  data: ComponentRawDataById<Id, Args>,
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

export type ComponentDataOrError<Id extends ComponentId, Args = unknown> =
  | { result: ComponentRawDataById<Id, Args> }
  | { error: ComponentErrorById<Id, Args> };

export type ComponentClientDataResolver<Id extends ComponentId> = {
  getDefaultData: <Args>(
    options: ComponentOptionsById<Id, Args>,
    context: ForeignComponentClientDataResolverContext
  ) => ComponentClientDataById<Id, Args>;

  toClient: <Args>(
    data: ComponentRawDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>,
    context: ForeignComponentClientDataResolverContext
  ) => MaybePromise<ComponentClientDataById<Id, Args>>;

  fromClient: <Args>(
    clientData: ComponentClientDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>,
    context: ForeignComponentClientDataResolverContext
  ) => ComponentDataOrError<Id, Args>;
};

export type ComponentStorageDataResolver<Id extends ComponentId> = {
  toStorage: <Args>(
    data: ComponentRawDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>,
    context: ForeignComponentStorageDataResolverContext
  ) => MaybePromise<ComponentStorageDataById<Id, Args>>;

  fromStorage: <Args>(
    data: ComponentStorageDataById<Id, Args>,
    options: ComponentOptionsById<Id, Args>,
    context: ForeignComponentStorageDataResolverContext
  ) => MaybePromise<ComponentRawDataById<Id, Args>>;
};

export type ComponentMeta<Id extends ComponentId = ComponentId> = {
  id: Id;
  config?: ComponentControllerConfig;
  defaultRawData:
    | ComponentRawDataById<Id>
    | (<Args>(
        options: ComponentOptionsById<Id, Args>,
        context: ForeignComponentDefaultDataContext
      ) => ComponentRawDataById<Id, Args>);
};

export interface ComponentController<Id extends ComponentId = ComponentId> {
  meta: ComponentMeta<Id>;
  resolver?: ComponentDataResolver<Id>;
  storageResolver?: ComponentStorageDataResolver<Id>;
  validator: ComponentDataValidator<Id>;
}

export type ComponentControllerMap = {
  [Id in keyof ComponentTypeMap]: ComponentController<Id>;
};

export type ComponentClientModule<Id extends ComponentId = ComponentId> = {
  renderer: ComponentRenderer<Id>;
};

/*@__NO_SIDE_EFFECTS__*/
export function component<Id extends ComponentId>(
  value: ComponentController<Id>
) {
  return value;
}

export function componentAccessor<Id extends string>(
  controller: ComponentController<Id>
) {
  return <Args>(
    input: Omit<ComponentSchema<Id, Args>, 'componentId' | 'config'>
  ): ComponentSchema<Id, Args> => {
    return { componentId: controller.meta.id, ...input };
  };
}

export function componentMeta<Id extends string>(value: ComponentMeta<Id>) {
  return value;
}
