import type { MaybeFactory } from '@game-cms/shared';
import type { FC } from 'react';

import type { DefaultExport, IdArrayToMap } from './typeutil.js';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ComponentMap extends Record<string, ComponentController> {}

export type ComponentId = keyof ComponentMap;

export type ComponentDataAtom = string | number | boolean | null;
export type ComponentData =
  | ComponentDataAtom
  | ComponentData[]
  | { [K in string]: ComponentData };

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
> = BaseComponentSchema<Options, ComponentController<Options, Data, Error, Id>>;

export interface ClientComponentSchema<
  Options extends ComponentOptions = ComponentOptions,
  Data extends ComponentData = ComponentData,
> extends BaseComponentSchema<Options, ComponentId> {
  defaultData: Data;
}

export type ComponentApi = {
  getDefaultData: <Id extends ComponentId>(
    id: Id,
    options: ComponentOptionsById<Id>
  ) => ComponentDataById<Id>;
  getComponent: <Id extends ComponentId>(
    id: Id
  ) => ForeignComponentRenderer<Id>;
};

export type ComponentProps<
  Options extends ComponentOptions = ComponentOptions,
  Data extends ComponentData = ComponentData,
  Error = unknown,
> = {
  api: ComponentApi;
  data: Data;
  options: Options;
  error?: Error;
  onDataChanged?: (data: Data) => void;
};

export type GetComponentControllerById<Id extends ComponentId> =
  ComponentMap[Id];

type InferControllerParams<Controller> =
  Controller extends ComponentController<
    infer Options,
    infer Data,
    infer Error,
    infer Id
  >
    ? {
        options: Options;
        data: Data;
        error: Error;
        id: Id;
      }
    : never;

export type InferComponentOptions<Controller> =
  InferControllerParams<Controller>['options'];

export type InferComponentData<Controller> =
  InferControllerParams<Controller>['data'];

export type InferComponentError<Controller> =
  InferControllerParams<Controller>['error'];

export type ComponentDataById<T extends ComponentId> = InferComponentData<
  GetComponentControllerById<T>
>;

export type ComponentOptionsById<T extends ComponentId> = InferComponentOptions<
  GetComponentControllerById<T>
>;

export type ComponentErrorById<T extends ComponentId> = InferComponentError<
  GetComponentControllerById<T>
>;

export type ComponentPropsById<Id extends ComponentId = ComponentId> =
  ComponentProps<
    ComponentOptionsById<Id>,
    ComponentDataById<Id>,
    ComponentErrorById<Id>
  >;

export type ComponentRenderer<Id extends ComponentId = ComponentId> = FC<
  ComponentPropsById<Id>
>;

export type ForeignComponentRenderer<Id extends ComponentId = ComponentId> = FC<
  Omit<ComponentPropsById<Id>, 'api'>
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

export type ComponentMeta<
  Options extends ComponentOptions = ComponentOptions,
  Data extends ComponentData = ComponentData,
  Id extends string = string,
> = {
  id: Id;
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
> {
  meta: ComponentMeta<Options, Data, Id>;
  config?: ComponentControllerConfig;
  validation: {
    data: ComponentDataValidator<Options, Data, Error>;
  };
}

export type ComponentControllerMap<K extends string | number = ComponentId> =
  Pick<ComponentMap, K>;

export type ResolveComponents<T extends DefaultExport<{ id: string }>[]> =
  IdArrayToMap<T>;

export type ComponentClientModule<Id extends ComponentId = ComponentId> = {
  validator?: ComponentDataValidatorById<Id>;
  renderer: ComponentRenderer<Id>;
};

export type ComponentsFsInfo = {
  distributions: string[];
};
