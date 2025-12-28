import type { MaybeFactory } from '@game-cms/shared';
import type { FC } from 'react';

import type { DefaultExport, IdArrayToMap } from './typeutil.js';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ComponentMap extends Record<string, ComponentController> {}

export type ComponentId = keyof ComponentMap;

export const COMPONENT_DATA_RAW = Symbol();
export const COMPONENT_DATA_RESOLVED = Symbol();

export type ComponentDataAtom = unknown; // string | number | boolean | null;
export type ComponentData =
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  ComponentDataAtom | ComponentData[] | { [K in string]: ComponentData };

export type ComponentOptions = ComponentData;

export type BaseComponentSchema<
  Options extends ComponentOptions,
  Controller,
> = {
  config?: ComponentControllerConfig;
  options: Options;
  controller: Controller;
};

export type ServerComponentSchema<
  Options extends ComponentOptions = ComponentOptions,
  Data extends ComponentData = ComponentData,
  Error = unknown,
  Id extends string = string,
  ResolvedData extends ComponentData = Data,
  ClientData extends ComponentData = Data,
> = BaseComponentSchema<
  Options,
  ComponentController<Options, Data, Error, Id, ResolvedData, ClientData>
>;

export interface ClientComponentSchema<
  Options extends ComponentOptions = ComponentOptions,
  Data extends ComponentData = ComponentData,
> extends BaseComponentSchema<Options, ComponentId> {
  defaultData: Data;
}

export type GetComponentControllerById<Id extends ComponentId> =
  ComponentMap[Id];

type InferControllerParams<Controller> =
  Controller extends ComponentController<
    infer Options,
    infer Data,
    infer Error,
    infer Id,
    infer ResolvedData,
    infer ClientData
  >
    ? {
        options: Options;
        data: Data;
        error: Error;
        id: Id;
        resolvedData: ResolvedData;
        clientData: ClientData;
      }
    : never;

type InferControllerParamsById<Id extends ComponentId> = InferControllerParams<
  GetComponentControllerById<Id>
>;

export type ComponentDataById<T extends ComponentId> =
  InferControllerParamsById<T>['data'];

export type ComponentResolvedDataById<T extends ComponentId> =
  InferControllerParamsById<T>['data'];

export type ComponentClientDataById<T extends ComponentId> =
  InferControllerParamsById<T>['clientData'];

export type ComponentOptionsById<T extends ComponentId> =
  InferControllerParamsById<T>['options'];

export type ComponentErrorById<T extends ComponentId> =
  InferControllerParamsById<T>['error'];

export type ComponentProps<
  Options extends ComponentOptions = ComponentOptions,
  Data extends ComponentData = ComponentData,
  Error = unknown,
> = {
  data: Data;
  options: Options;
  error?: Error;
  onDataChanged?: (data: Data) => void;
};

export type ComponentPropsById<Id extends ComponentId = ComponentId> =
  ComponentProps<
    ComponentOptionsById<Id>,
    ComponentClientDataById<Id>,
    ComponentErrorById<Id>
  >;

export type ComponentRenderer<Id extends ComponentId = ComponentId> = FC<
  ComponentPropsById<Id>
>;

export type ComponentControllerConfig = {
  ui?: {
    compact?: boolean;
  };
};

export type ForeignComponentContext = {
  validation: {
    data: <Id extends ComponentId>(
      id: Id,
      data: ComponentDataById<Id>,
      options: ComponentOptionsById<Id>
    ) => ComponentErrorById<Id> | undefined;
  };
  default: {
    data: <Id extends ComponentId>(
      id: Id,
      options: ComponentOptionsById<Id>
    ) => ComponentDataById<Id>;
  };
  resolver: {
    data: <Id extends ComponentId>(
      id: Id,
      data: ComponentDataById<Id>,
      options: ComponentOptionsById<Id>,
      args: ComponentDataResolverArgs
    ) => ComponentResolvedDataById<Id>;
  };
  clientResolver: {
    toClient: <Id extends ComponentId>(
      id: Id,
      data: ComponentDataById<Id>,
      options: ComponentOptionsById<Id>
    ) => ComponentClientDataById<Id>;

    fromClient: <Id extends ComponentId>(
      id: Id,
      clientData: ComponentClientDataById<Id>,
      options: ComponentOptionsById<Id>
    ) => { result: ComponentDataById<Id> } | { error: ComponentErrorById<Id> };
  };
};

export type ComponentDataValidator<
  Options extends ComponentOptions = ComponentOptions,
  Data extends ComponentData = ComponentData,
  Error = unknown,
> = (
  data: Data,
  options: Options,
  context: ForeignComponentContext['validation']
) => Error | undefined;

export type ComponentDataValidatorById<Id extends ComponentId> =
  ComponentDataValidator<
    ComponentOptionsById<Id>,
    ComponentDataById<Id>,
    ComponentErrorById<Id>
  >;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ComponentDataResolverArgs {}

export type ComponentDataResolver<
  Raw extends ComponentData,
  Resolved extends ComponentData,
  Options extends ComponentOptions,
> = (
  raw: Raw,
  options: Options,
  context: ForeignComponentContext['resolver'],
  args: ComponentDataResolverArgs
) => Resolved;

export type ComponentClientDataResolver<Id extends ComponentId> = {
  toClient: (
    data: ComponentDataById<Id>,
    options: ComponentOptionsById<Id>,
    context: ForeignComponentContext['clientResolver']
  ) => ComponentClientDataById<Id>;

  fromClient: (
    clientData: ComponentClientDataById<Id>,
    options: ComponentOptionsById<Id>,
    context: ForeignComponentContext['clientResolver']
  ) => { result: ComponentDataById<Id> } | { error: ComponentErrorById<Id> };
};

export type ComponentMeta<
  Options extends ComponentOptions = ComponentOptions,
  Data extends ComponentData = ComponentData,
  Id extends string = string,
> = {
  id: Id;
  config?: ComponentControllerConfig;
  defaultData: MaybeFactory<
    Data,
    [options: Options, context: ForeignComponentContext['default']]
  >;
};

export interface ComponentController<
  Options extends ComponentOptions = ComponentOptions,
  Data extends ComponentData = ComponentData,
  Error = unknown,
  Id extends string = string,
  ResolvedData extends ComponentData = Data,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _ClientData extends ComponentData = Data,
> {
  meta: ComponentMeta<Options, Data, Id>;
  resolver?: ComponentDataResolver<Data, ResolvedData, Options>;

  validator: ComponentDataValidator<Options, Data, Error>;
}

export type ComponentControllerMap<K extends string | number = ComponentId> =
  Pick<ComponentMap, K>;

export type ResolveComponents<T extends DefaultExport<{ id: string }>[]> =
  IdArrayToMap<T>;

export type ComponentClientModule<Id extends ComponentId = ComponentId> = {
  dataResolver: ComponentClientDataById<Id>;
  renderer: ComponentRenderer<Id>;
};

export type ComponentsFsInfo = {
  distributions: string[];
};
